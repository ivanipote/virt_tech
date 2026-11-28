// --- coursService.js ---
// Cours Â« Cours De Base Â» stockÃ©s en base (crÃ©ation / Ã©dition rapide).

const { pool } = require('../database');

function erreur(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}

const MOTIF_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function verifierDonnees({ slug, titre, contenu, ordre }) {
    if (!MOTIF_SLUG.test(String(slug || ''))) {
        throw erreur(400, "Le slug doit Ãªtre en minuscules, sans espaces (ex. Â« mon-cours Â»).");
    }

    if (!String(titre || '').trim() || String(titre).length > 160) {
        throw erreur(400, "Le titre est obligatoire (160 caractÃ¨res maximum).");
    }

    if (!String(contenu || '').trim()) {
        throw erreur(400, "Le contenu du cours est obligatoire.");
    }

    if (ordre !== undefined && !Number.isInteger(Number(ordre))) {
        throw erreur(400, "L'ordre doit Ãªtre un nombre entier.");
    }
}

async function lister() {
    const res = await pool.query(
        'SELECT slug, titre, ordre, vues, date_creation FROM cours WHERE visible = TRUE ORDER BY date_creation DESC, id DESC'
    );
    return res.rows;
}

async function ajouterVue(slug) {
    const res = await pool.query(
        'UPDATE cours SET vues = vues + 1 WHERE slug = $1 RETURNING vues',
        [slug]
    );

    if (!res.rows.length) throw erreur(404, "Cours introuvable.");

    return { vues: res.rows[0].vues };
}

async function listerTous() {
    const res = await pool.query(
        'SELECT slug, titre, ordre, visible, date_modification FROM cours ORDER BY ordre ASC, id ASC'
    );
    return res.rows;
}

async function lire(slug) {
    const res = await pool.query('SELECT slug, titre, contenu, ordre FROM cours WHERE slug = $1', [slug]);

    if (!res.rows.length) throw erreur(404, "Cours introuvable.");

    return res.rows[0];
}

async function creer(donnees) {
    verifierDonnees(donnees);

    const res = await pool.query(
        `INSERT INTO cours (slug, titre, contenu, ordre)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (slug) DO UPDATE
            SET titre = EXCLUDED.titre,
                contenu = EXCLUDED.contenu,
                ordre = EXCLUDED.ordre,
                date_modification = CURRENT_TIMESTAMP
         RETURNING slug`,
        [donnees.slug, String(donnees.titre).trim(), donnees.contenu, Number(donnees.ordre || 0)]
    );

    return res.rows[0];
}

async function modifier(slug, donnees) {
    const existant = await pool.query('SELECT slug FROM cours WHERE slug = $1', [slug]);
    if (!existant.rows.length) throw erreur(404, "Cours introuvable.");

    if (donnees.titre !== undefined || donnees.contenu !== undefined) {
        verifierDonnees({
            slug,
            titre: donnees.titre || 'titre',
            contenu: donnees.contenu || 'contenu',
            ordre: donnees.ordre
        });
    }

    await pool.query(
        `UPDATE cours
         SET titre = COALESCE($2, titre),
             contenu = COALESCE($3, contenu),
             ordre = COALESCE($4, ordre),
             visible = COALESCE($5, visible),
             date_modification = CURRENT_TIMESTAMP
         WHERE slug = $1`,
        [
            slug,
            donnees.titre === undefined ? null : String(donnees.titre).trim(),
            donnees.contenu === undefined ? null : donnees.contenu,
            donnees.ordre === undefined ? null : Number(donnees.ordre),
            donnees.visible === undefined ? null : !!donnees.visible
        ]
    );

    return { slug };
}

async function supprimer(slug) {
    const res = await pool.query('DELETE FROM cours WHERE slug = $1 RETURNING slug', [slug]);
    if (!res.rows.length) throw erreur(404, "Cours introuvable.");
    return { slug };
}

module.exports = { lister, listerTous, lire, ajouterVue, creer, modifier, supprimer };
