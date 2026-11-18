const express = require('express');
const router = express.Router();
const service = require('../services/iaService');

// ---------------------------------------------------------------------
// Limites anti-abus
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
// Validation
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

// ---------------------------------------------------------------------
// POST /api/ia  { message, historique }
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
        const reponse = await service.demander(message, historique);

        res.json({ succes: true, reponse });
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

module.exports = router;
