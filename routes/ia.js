const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const service = require('../services/iaService');
const appareil = require('../services/appareilService');
const echange = require('../services/iaEchangeService');

// ---------------------------------------------------------------------
// Limites anti-abus (messages)
// ---------------------------------------------------------------------
const LIMITE_PAR_IP = 10;                 // messages
const FENETRE_MS = 10 * 60 * 1000;        // par 10 minutes
const PLAFOND_JOUR = 300;                 // au total, tous visiteurs confondus

const compteursIp = new Map();
setInterval(() => {
    const maintenant = Date.now();
    for (const [ip, e] of compteursIp) {
        if (e.fin <= maintenant) compteursIp.delete(ip);
    }
}, 60000).unref();

let jourCourant = new Date().toISOString().slice(0, 10);
let totalJour = 0;

function autoriser(req) {
    const aujourdhui = new Date().toISOString().slice(0, 10);
    if (aujourdhui !== jourCourant) {
        jourCourant = aujourdhui;
        totalJour = 0;
    }

    if (totalJour >= PLAFOND_JOUR) {
        return { ok: false, message: "L'assistant fait une pause pour aujourd'hui. Reviens demain !" };
    }

    const maintenant = Date.now();
    let e = compteursIp.get(req.ip);

    if (!e || e.fin <= maintenant) {
        e = { n: 0, fin: maintenant + FENETRE_MS };
        compteursIp.set(req.ip, e);
    }

    if (e.n >= LIMITE_PAR_IP) {
        const minutes = Math.ceil((e.fin - maintenant) / 60000);
        return { ok: false, message: `Trop de messages. Réessaie dans ${minutes} minute(s).` };
    }

    e.n++;
    totalJour++;
    return { ok: true };
}

// ---------------------------------------------------------------------
// Utilitaires
// ---------------------------------------------------------------------
function nettoyerHistorique(historique) {
    if (!Array.isArray(historique)) return [];

    return historique
        .filter(function (m) {
            return m
                && (m.role === "user" || m.role === "assistant")
                && typeof m.content === "string"
                && m.content.trim().length > 0;
        })
        .slice(-8)
        .map(function (m) {
            return { role: m.role, content: m.content.trim().slice(0, 1000) };
        });
}

// IP hachée : on peut compter les abus sans stocker l'adresse en clair
function hasherIp(ip) {
    const sel = process.env.IP_HASH_SALT || "virttech-ip";
    return crypto.createHash("sha256").update(String(ip) + "|" + sel).digest("hex");
}

function langue(req) {
    const brut = String(req.headers["accept-language"] || "");
    return brut.split(",")[0].trim().slice(0, 20) || null;
}

// ---------------------------------------------------------------------
// POST /api/ia  { message, historique, conversation_id }
// ---------------------------------------------------------------------
router.post('/', async (req, res) => {
    try {
        const message = typeof req.body.message === "string" ? req.body.message.trim() : "";

        if (!message) {
            return res.status(400).json({ succes: false, message: "Ton message est vide." });
        }
        if (message.length > 1000) {
            return res.status(400).json({ succes: false, message: "Message trop long (1 000 caractères maximum)." });
        }

        const autorisation = autoriser(req);
        if (!autorisation.ok) {
            return res.status(429).json({ succes: false, message: autorisation.message });
        }

        const historique = nettoyerHistorique(req.body.historique);
        const contexte = typeof req.body.contexte === "string" ? req.body.contexte.slice(0, 12000) : "";
        const mode = req.body.mode === "code" ? "code" : "lecture";

        const debut = Date.now();
        const resultat = await service.demander(message, historique, contexte, mode);
        const latence = Date.now() - debut;

        // Enregistrement pour analyse + avis (ne bloque pas la réponse en cas d'échec)
        const infos = appareil.detecter(req.headers["user-agent"], req.headers);
        let id = null;

        try {
            const ligne = await echange.enregistrer({
                conversationId: String(req.body.conversation_id || "").slice(0, 64) || null,
                question: message,
                reponse: resultat.texte,
                modele: resultat.modele,
                tokensEntree: resultat.tokensEntree,
                tokensSortie: resultat.tokensSortie,
                latence: latence,
                type: infos.type,
                marque: infos.marque,
                modeleAppareil: infos.modele,
                os: infos.os,
                navigateur: infos.navigateur,
                langue: langue(req),
                ipHash: hasherIp(req.ip)
            });
            id = ligne.id;
        } catch (e) {
            console.error("[ia] enregistrement impossible :", e.message);
        }

        res.json({ succes: true, reponse: resultat.texte, id });
    } catch (error) {
        const status = error.status || 500;
        if (status >= 500) console.error("[ia]", error.message);
        res.status(status).json({
            succes: false,
            message: status >= 500
                ? "L'assistant est momentanément indisponible. Réessaie dans un instant."
                : error.message
        });
    }
});

// ---------------------------------------------------------------------
// POST /api/ia/:id/avis  { note: 1 | -1 | 0 }
// ---------------------------------------------------------------------
router.post('/:id/avis', async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const note = Number(req.body.note);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ succes: false, message: "Identifiant invalide." });
        }
        if (![-1, 0, 1].includes(note)) {
            return res.status(400).json({ succes: false, message: "Avis invalide." });
        }

        const ok = await echange.noter(id, note);
        if (!ok) {
            return res.status(404).json({ succes: false, message: "Réponse introuvable." });
        }

        res.json({ succes: true, note });
    } catch (error) {
        console.error("[ia] avis :", error.message);
        res.status(500).json({ succes: false, message: "Erreur serveur." });
    }
});

module.exports = router;
