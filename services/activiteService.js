const { pool } = require('../database');

// Slugs autorisés : ils doivent correspondre aux data-slug du HTML
const SLUGS = ['virtdev', 'arborescence', 'erreurs', 'corriger', 'balises', 'structure', 'deepseek', 'apikey', 'tarifs'];

function erreur(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}

// Incrémente le compteur d'une activité et renvoie le nouveau total
async function enregistrerClic(slug) {
    if (typeof slug !== 'string' || !SLUGS.includes(slug)) {
        throw erreur(404, "Activité inconnue.");
    }

    const res = await pool.query(
        `INSERT INTO activites_clics (slug, clics)
         VALUES ($1, 1)
         ON CONFLICT (slug)
         DO UPDATE SET clics = activites_clics.clics + 1,
                       derniere_maj = CURRENT_TIMESTAMP
         RETURNING clics`,
        [slug]
    );

    return Number(res.rows[0].clics);
}

// Tous les compteurs (0 par défaut, même si la table est vide)
async function getStats() {
    const res = await pool.query('SELECT slug, clics FROM activites_clics');

    const stats = {};
    SLUGS.forEach(function (slug) { stats[slug] = 0; });
    res.rows.forEach(function (ligne) {
        if (SLUGS.includes(ligne.slug)) stats[ligne.slug] = Number(ligne.clics);
    });

    return stats;
}

module.exports = { SLUGS, enregistrerClic, getStats };
