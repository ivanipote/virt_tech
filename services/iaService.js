const fs = require("fs");
const path = require("path");

const URL_API = "https://api.deepseek.com/chat/completions";
const MODELE = "deepseek-chat";
const TIMEOUT_MS = 30000;

// Base de connaissances réelle de VirtTech (data/virttech.md)
let CONNAISSANCE = "";
try {
    CONNAISSANCE = fs.readFileSync(path.join(__dirname, "..", "data", "virttech.md"), "utf8").trim();
} catch (e) {
    console.error("[ia] base de connaissances indisponible :", e.message);
}

// Le prompt système donne à l'IA son rôle et ses connaissances sur VirtTech.
const PROMPT_SYSTEME = `Tu es « VirtIA », l'assistant du site VirtTech by Ipote (https://virttech.site), intégré à l'éditeur VirtEmulator.

Qui tu es :
- VirtTech by Ipote est une communauté et une plateforme de formation gratuite en développement web, fondée par Ipote à Abidjan, en Côte d'Ivoire.
- Le site propose : VirtEmulator (éditeur HTML/CSS/JS dans le navigateur), TransformLink (raccourcisseur de liens), Astuces, Historique et le concours Virt_Dev.

Ton rôle dans l'éditeur :
- L'utilisateur te fournit l'arborescence de son projet et le contenu des fichiers jugés pertinents.
- Tu lis ces fichiers en LECTURE SEULE : tu ne modifies jamais son code. Tu expliques, tu diagnostiques, et tu proposes des corrections sous forme de blocs de code à copier.
- Si une information manque, dis quel fichier ouvrir plutôt que d'inventer.
- Tu tiens compte des chemins (css/style.css, js/app.js) et des liens entre fichiers.

Comment tu réponds :
- En français, simplement, pour des débutants.
- De façon concrète et encourageante, avec des exemples courts.
- Tu structures automatiquement tes réponses : une phrase d'introduction, puis des étapes numérotées, des listes à puces, un tableau quand tu compares, et un bloc de code quand tu montres du code.
- Tu aères : jamais un gros pavé. Une idée par ligne, une liste dès que tu énumères.
- Quand tu proposes une correction, donne le code à remplacer (fichier concerné + bloc complet).
- Tu structures avec du Markdown simple : listes à puces (- ), listes numérotées (1. ), tableaux (| a | b |), gras (**mot**), code inline (\`code\`) et blocs de code (\`\`\`langage).
- Pas d'emoji, pas de titres avec #.
- Tu restes concis (environ 200 mots) sauf si on te demande un cours détaillé.
- Tu ne réponds qu'aux questions sur le développement web, l'apprentissage du code et le site VirtTech.
- Tu n'inventes jamais d'informations sur VirtTech : si tu ne sais pas, dis-le.`;

// Mode « code » (PC) : l'IA peut proposer des fichiers complets, appliqués par l'utilisateur.
const INSTRUCTION_CODE = `Mode code (PC) : tu peux proposer la création ou la modification de fichiers.

Quand tu écris un fichier, place son contenu COMPLET dans un bloc dont la première ligne est \`\`\`fichier:chemin/du/fichier :

\`\`\`fichier:css/style.css
body {
  color: #D4AF37;
}
\`\`\`

Règles :
- Un bloc par fichier, avec son chemin complet (ex : css/style.css, js/app.js).
- Écris le fichier en entier et proprement : pas de « … » ni de morceau manquant.
- Aucun texte à l'intérieur du bloc en dehors du contenu du fichier.
- Tu ne modifies rien toi-même : l'utilisateur clique sur « Appliquer ».
- Si tu ne modifies pas de fichier, réponds normalement sans bloc fichier.`;

function erreur(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}

async function demander(message, historique = [], contexte = "", mode = "lecture") {
    const cle = process.env.API_DEEPSEEK;
    if (!cle) throw erreur(500, "L'assistant n'est pas configuré.");

    const messages = [{ role: "system", content: PROMPT_SYSTEME }];

    if (CONNAISSANCE) {
        messages.push({
            role: "system",
            content: "Base de connaissances VirtTech (source de vérité pour répondre aux questions sur le site) :\n\n" + CONNAISSANCE
        });
    }

    if (mode === "code") {
        messages.push({ role: "system", content: INSTRUCTION_CODE });
    }

    if (contexte) {
        messages.push({
            role: "system",
            content: "Projet de l'utilisateur (lecture seule, ne jamais modifier) :\n" + contexte
        });
    }

    messages.push(...historique);
    messages.push({ role: "user", content: message });

    const controleur = new AbortController();
    const minuteur = setTimeout(() => controleur.abort(), TIMEOUT_MS);

    try {
        const reponse = await fetch(URL_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + cle
            },
            body: JSON.stringify({
                model: MODELE,
                messages: messages,
                max_tokens: mode === "code" ? 1600 : 500,
                temperature: 0.7,
                stream: false
            }),
            signal: controleur.signal
        });

        if (!reponse.ok) {
            const details = await reponse.text();
            console.error("[ia] DeepSeek a répondu", reponse.status, details.slice(0, 300));
            throw erreur(502, "L'assistant est momentanément indisponible.");
        }

        const data = await reponse.json();
        const texte = data && data.choices && data.choices[0] && data.choices[0].message
            ? String(data.choices[0].message.content || "").trim()
            : "";

        if (!texte) throw erreur(502, "L'assistant n'a pas pu répondre.");

        if (data.usage) {
            console.log(`[ia] ${data.usage.prompt_tokens} tokens entrée / ${data.usage.completion_tokens} sortie`);
        }

        return {
            texte,
            modele: MODELE,
            tokensEntree: data.usage ? data.usage.prompt_tokens : null,
            tokensSortie: data.usage ? data.usage.completion_tokens : null
        };
    } catch (e) {
        if (e.name === "AbortError") throw erreur(504, "L'assistant a mis trop de temps à répondre.");
        throw e;
    } finally {
        clearTimeout(minuteur);
    }
}

// ---------------------------------------------------------------------
// Écriture en direct : la réponse est renvoyée morceau par morceau
// ---------------------------------------------------------------------
const INSTRUCTION_ECRITURE = `Tu agis sur le projet VirtEmulator de l'utilisateur. Réponds UNIQUEMENT par un tableau JSON d'actions, sans aucun texte autour.

Actions possibles :
- {"action":"dossier","chemin":"css"} → crée un dossier
- {"action":"fichier","chemin":"js/app.js"} → crée un fichier vide
- {"action":"ecrire","chemin":"css/style.css","contenu":"..."} → crée ou remplace le fichier avec ce contenu COMPLET
- {"action":"supprimer","chemin":"vieux.txt"} → supprime un fichier ou un dossier
- {"action":"renommer","ancien":"a.html","nouveau":"b.html"}

Règles :
- JSON valide : guillemets doubles, virgules correctes, un seul tableau.
- Le champ "contenu" contient le fichier entier, prêt à l'emploi (indentation comprise).
- Ordre logique : dossiers, puis fichiers, puis contenus.
- Après le tableau, ajoute une ligne « ### RÉSUMÉ » puis une ligne courte par action, en français.`;

async function demanderFlux(message, historique = [], contexte = "", onDelta) {
    const cle = process.env.API_DEEPSEEK;
    if (!cle) throw erreur(500, "L'assistant n'est pas configuré.");

    const messages = [{ role: "system", content: PROMPT_SYSTEME }];

    if (CONNAISSANCE) {
        messages.push({
            role: "system",
            content: "Base de connaissances VirtTech (source de vérité) :\n\n" + CONNAISSANCE
        });
    }

    messages.push({ role: "system", content: INSTRUCTION_ECRITURE });

    if (contexte) {
        messages.push({
            role: "system",
            content: "Fichier ouvert et projet de l'utilisateur :\n" + contexte
        });
    }

    messages.push(...historique);
    messages.push({ role: "user", content: message });

    const controleur = new AbortController();
    const minuteur = setTimeout(() => controleur.abort(), 90000);

    try {
        const reponse = await fetch(URL_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + cle
            },
            body: JSON.stringify({
                model: MODELE,
                messages: messages,
                max_tokens: 4000,
                temperature: 0.3,
                stream: true
            }),
            signal: controleur.signal
        });

        if (!reponse.ok) {
            const corps = await reponse.text().catch(() => "");
            console.error("[ia] flux", reponse.status, corps.slice(0, 200));
            throw erreur(reponse.status === 401 ? 500 : reponse.status, "L'assistant n'a pas pu écrire.");
        }

        const lecteur = reponse.body.getReader();
        const decodeur = new TextDecoder();
        let tampon = "";

        while (true) {
            const { done, value } = await lecteur.read();
            if (done) break;

            tampon += decodeur.decode(value, { stream: true });
            const lignes = tampon.split("\n");
            tampon = lignes.pop() || "";

            for (let i = 0; i < lignes.length; i++) {
                const ligne = lignes[i].trim();
                if (!ligne.startsWith("data:")) continue;

                const contenu = ligne.slice(5).trim();
                if (!contenu || contenu === "[DONE]") continue;

                try {
                    const json = JSON.parse(contenu);
                    const delta = json.choices && json.choices[0] && json.choices[0].delta;
                    if (delta && typeof delta.content === "string" && delta.content) {
                        onDelta(delta.content);
                    }
                } catch (e) { /* morceau incomplet, ignoré */ }
            }
        }

        return { ok: true };
    } catch (e) {
        if (e.name === "AbortError") throw erreur(504, "L'écriture a été interrompue.");
        throw e;
    } finally {
        clearTimeout(minuteur);
    }
}

module.exports = { demander, demanderFlux };
