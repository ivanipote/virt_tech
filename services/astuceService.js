const { pool } = require('../database');

// ---------------------------------------------------------------------
// Constantes (doivent rester identiques au schema.sql et au <select> du front)
// ---------------------------------------------------------------------
const LANGAGES = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'PHP', 'SQL', 'Bash', 'Autre'];
const NIVEAUX = ['Débutant', 'Intermédiaire', 'Avancé'];

const TRIS = {
    recentes:   'a.date_creation DESC, a.id DESC',
    populaires: 'a.likes DESC, a.date_creation DESC, a.id DESC',
    vues:       'a.vues DESC, a.date_creation DESC, a.id DESC'
};

// Colonnes envoyées au navigateur : owner_token n'y figure JAMAIS.
// $1 = jeton du visiteur (sert uniquement à calculer est_proprietaire / a_like côté serveur)
const COLONNES = `
    a.id, a.auteur, a.titre, a.contenu, a.langage, a.niveau, a.code,
    a.likes, a.vues, a.date_creation, a.date_modification,
    COALESCE(a.owner_token = $1, false) AS est_proprietaire,
    EXISTS (
        SELECT 1 FROM astuces_likes l
        WHERE l.astuce_id = a.id AND l.visiteur_token = $1
    ) AS a_like
`;

// ---------------------------------------------------------------------
// Utilitaires
// ---------------------------------------------------------------------
function erreur(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}

function idValide(id) {
    const n = Number.parseInt(id, 10);
    if (!Number.isInteger(n) || n <= 0) throw erreur(400, "Identifiant invalide.");
    return n;
}

function tokenValide(token) {
    if (typeof token !== 'string' || token.length < 8 || token.length > 255) {
        throw erreur(400, "Jeton visiteur invalide.");
    }
    return token;
}

function texte(valeur) {
    return typeof valeur === 'string' ? valeur.replace(/\r\n/g, '\n').trim() : '';
}

// Valide et nettoie les champs d'une astuce (création ET modification)
function validerAstuce(data = {}) {
    const auteur = texte(data.auteur);
    const titre = texte(data.titre);
    const contenu = texte(data.contenu);
    const code = texte(data.code);
    const langage = texte(data.langage) || 'Autre';
    const niveau = texte(data.niveau) || 'Débutant';

    if (auteur.length < 2 || auteur.length > 50) throw erreur(400, "Le nom doit faire entre 2 et 50 caractères.");
    if (titre.length < 3 || titre.length > 120) throw erreur(400, "Le titre doit faire entre 3 et 120 caractères.");
    if (contenu.length < 5 || contenu.length > 2000) throw erreur(400, "L'explication doit faire entre 5 et 2000 caractères.");
    if (code.length > 10000) throw erreur(400, "Le code est trop long (10 000 caractères maximum).");
    if (!LANGAGES.includes(langage)) throw erreur(400, "Langage non reconnu.");
    if (!NIVEAUX.includes(niveau)) throw erreur(400, "Niveau non reconnu.");

    return { auteur, titre, contenu, langage, niveau, code: code || null };
}

// ---------------------------------------------------------------------
// LECTURE
// ---------------------------------------------------------------------

/**
 * Liste filtrée, triée et paginée côté serveur.
 * options : { visiteur, recherche, langage, niveau, tri, mes, page, limite }
 * Retourne : { astuces, total, page, limite }
 */
async function getAstuces(options = {}) {
    const visiteur = typeof options.visiteur === 'string' ? options.visiteur.slice(0, 255) : '';
    const page = Math.max(1, Number.parseInt(options.page, 10) || 1);
    const limite = Math.min(24, Math.max(1, Number.parseInt(options.limite, 10) || 6));

    const params = [visiteur];
    const conditions = [];
    const ajouter = (valeur) => { params.push(valeur); return `$${params.length}`; };

    // Onglet "Mes astuces"
    if (options.mes) {
        if (!visiteur) return { astuces: [], total: 0, page, limite };
        conditions.push('a.owner_token = $1');
    }

    if (options.langage && LANGAGES.includes(options.langage)) {
        conditions.push(`a.langage = ${ajouter(options.langage)}`);
    }
    if (options.niveau && NIVEAUX.includes(options.niveau)) {
        conditions.push(`a.niveau = ${ajouter(options.niveau)}`);
    }

    // Recherche (titre, explication, code, auteur) avec échappement de % et _
    const recherche = texte(options.recherche).slice(0, 100);
    if (recherche) {
        const motif = ajouter(`%${recherche.replace(/[\\%_]/g, '\\$&')}%`);
        conditions.push(`(a.titre ILIKE ${motif} ESCAPE '\\' OR a.contenu ILIKE ${motif} ESCAPE '\\' OR a.code ILIKE ${motif} ESCAPE '\\' OR a.auteur ILIKE ${motif} ESCAPE '\\')`);
    }

    const ordre = TRIS[options.tri] || TRIS.recentes;
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const limiteParam = ajouter(limite);
    const offsetParam = ajouter((page - 1) * limite);

    const res = await pool.query(
        `SELECT ${COLONNES}, COUNT(*) OVER() AS total
         FROM astuces a
         ${where}
         ORDER BY ${ordre}
         LIMIT ${limiteParam} OFFSET ${offsetParam}`,
        params
    );

    const total = res.rows.length ? Number(res.rows[0].total) : 0;
    const astuces = res.rows.map(({ total: _t, ...ligne }) => ligne);
    return { astuces, total, page, limite };
}

// Une astuce précise (lien de partage /astuces#12)
async function getAstuceParId(id, visiteur = '') {
    const res = await pool.query(
        `SELECT ${COLONNES} FROM astuces a WHERE a.id = $2`,
        [typeof visiteur === 'string' ? visiteur.slice(0, 255) : '', idValide(id)]
    );
    return res.rows[0] || null;
}

// "Astuce du jour" : une astuce différente chaque jour, la même pour tout le monde
async function getAstuceDuJour(visiteur = '') {
    const res = await pool.query(
        `SELECT ${COLONNES} FROM astuces a
         ORDER BY md5(a.id::text || CURRENT_DATE::text)
         LIMIT 1`,
        [typeof visiteur === 'string' ? visiteur.slice(0, 255) : '']
    );
    return res.rows[0] || null;
}

// Compteur de communauté : "128 astuces · 40 devs"
async function getStats() {
    const res = await pool.query(
        `SELECT COUNT(*)::int AS astuces,
                COUNT(DISTINCT owner_token)::int AS contributeurs,
                COUNT(DISTINCT langage)::int AS langages
         FROM astuces`
    );
    return res.rows[0];
}

// ---------------------------------------------------------------------
// ÉCRITURE
// ---------------------------------------------------------------------

async function creerAstuce(data, ownerToken) {
    const a = validerAstuce(data);
    tokenValide(ownerToken);
    const res = await pool.query(
        `INSERT INTO astuces (auteur, titre, contenu, langage, niveau, code, owner_token)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [a.auteur, a.titre, a.contenu, a.langage, a.niveau, a.code, ownerToken]
    );
    return getAstuceParId(res.rows[0].id, ownerToken);
}

// Modification : uniquement par le propriétaire (retourne null sinon)
async function modifierAstuce(id, data, ownerToken) {
    const a = validerAstuce(data);
    tokenValide(ownerToken);
    const idAstuce = idValide(id);
    const res = await pool.query(
        `UPDATE astuces
         SET auteur = $1, titre = $2, contenu = $3, langage = $4, niveau = $5, code = $6,
             date_modification = CURRENT_TIMESTAMP
         WHERE id = $7 AND owner_token = $8
         RETURNING id`,
        [a.auteur, a.titre, a.contenu, a.langage, a.niveau, a.code, idAstuce, ownerToken]
    );
    if (!res.rows[0]) return null;
    return getAstuceParId(idAstuce, ownerToken);
}

// Suppression : uniquement par le propriétaire (retourne false sinon)
async function supprimerAstuce(id, ownerToken) {
    tokenValide(ownerToken);
    const res = await pool.query(
        'DELETE FROM astuces WHERE id = $1 AND owner_token = $2 RETURNING id',
        [idValide(id), ownerToken]
    );
    return res.rowCount > 0;
}

// ---------------------------------------------------------------------
// LIKES & VUES (un seul par appareil, garanti par la base de données)
// ---------------------------------------------------------------------

async function ajouterLike(id, visiteur) {
    const idAstuce = idValide(id);
    tokenValide(visiteur);
    try {
        const res = await pool.query(
            `WITH ins AS (
                 INSERT INTO astuces_likes (astuce_id, visiteur_token)
                 VALUES ($1, $2)
                 ON CONFLICT DO NOTHING
                 RETURNING 1
             )
             UPDATE astuces
             SET likes = likes + (SELECT COUNT(*)::int FROM ins)
             WHERE id = $1
             RETURNING likes`,
            [idAstuce, visiteur]
        );
        if (!res.rows[0]) throw erreur(404, "Astuce introuvable.");
        return res.rows[0].likes;
    } catch (err) {
        if (err.code === '23503') throw erreur(404, "Astuce introuvable."); // clé étrangère
        throw err;
    }
}

async function enleverLike(id, visiteur) {
    const idAstuce = idValide(id);
    tokenValide(visiteur);
    const res = await pool.query(
        `WITH del AS (
             DELETE FROM astuces_likes
             WHERE astuce_id = $1 AND visiteur_token = $2
             RETURNING 1
         )
         UPDATE astuces
         SET likes = GREATEST(0, likes - (SELECT COUNT(*)::int FROM del))
         WHERE id = $1
         RETURNING likes`,
        [idAstuce, visiteur]
    );
    if (!res.rows[0]) throw erreur(404, "Astuce introuvable.");
    return res.rows[0].likes;
}

async function ajouterVue(id, visiteur) {
    const idAstuce = idValide(id);
    tokenValide(visiteur);
    try {
        const res = await pool.query(
            `WITH ins AS (
                 INSERT INTO astuces_vues (astuce_id, visiteur_token)
                 VALUES ($1, $2)
                 ON CONFLICT DO NOTHING
                 RETURNING 1
             )
             UPDATE astuces
             SET vues = vues + (SELECT COUNT(*)::int FROM ins)
             WHERE id = $1
             RETURNING vues`,
            [idAstuce, visiteur]
        );
        if (!res.rows[0]) throw erreur(404, "Astuce introuvable.");
        return res.rows[0].vues;
    } catch (err) {
        if (err.code === '23503') throw erreur(404, "Astuce introuvable.");
        throw err;
    }
}

module.exports = {
    LANGAGES,
    NIVEAUX,
    getAstuces,
    getAstuceParId,
    getAstuceDuJour,
    getStats,
    creerAstuce,
    modifierAstuce,
    supprimerAstuce,
    ajouterLike,
    enleverLike,
    ajouterVue
};