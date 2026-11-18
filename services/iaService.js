const URL_API = "https://api.deepseek.com/chat/completions";
const MODELE = "deepseek-chat";
const TIMEOUT_MS = 30000;

// Le prompt système donne à l'IA son rôle et ses connaissances sur VirtTech.
const PROMPT_SYSTEME = `Tu es « VirtAi », l'assistant du site VirtTech by Ipote (https://virttech.site).

Qui tu es :
- VirtTech by Ipote est une communauté et une plateforme de formation gratuite en développement web, fondée par Ipote à Abidjan, en Côte d'Ivoire.
- Le site propose : VirtEmulator (éditeur HTML/CSS/JS dans le navigateur), TransformLink (raccourcisseur de liens), Astuces (partage d'astuces), Historique (concours, formations et cours) et le concours Virt_Dev.
- Les cours disponibles : les codes d'erreur HTTP (400, 401, 403, 404, 405, 408, 410, 429, 500, 502, 503, 504), comment corriger ces erreurs, les balises HTML usuelles, la structure d'une page web, l'arborescence d'un projet.

Comment tu réponds :
- En français, simplement, pour des débutants.
- De façon concrète et encourageante, avec des exemples courts.
- Tu structures avec du Markdown simple : listes à puces (- ), listes numérotées (1. ), tableaux (| a | b |), gras (**mot**), code inline (\`code\`) et blocs de code (\`\`\`langage).
- Pas d'emoji, pas de titres avec #.
- Tu restes concis (environ 150 mots) sauf si on te demande un cours détaillé.
- Tu ne réponds qu'aux questions sur le développement web, l'apprentissage du code et le site VirtTech. Pour tout le reste, dis poliment que tu es là pour ça.
- Tu n'inventes jamais d'informations sur VirtTech : si tu ne sais pas, dis-le.
- Tu ne donnes jamais d'informations personnelles sur les membres.`;

function erreur(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}

async function demander(message, historique = []) {
    const cle = process.env.API_DEEPSEEK;
    if (!cle) throw erreur(500, "L'assistant n'est pas configuré.");

    const messages = [
        { role: "system", content: PROMPT_SYSTEME },
        ...historique,
        { role: "user", content: message }
    ];

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
                max_tokens: 500,
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

module.exports = { demander };
