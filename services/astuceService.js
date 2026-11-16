const { pool } = require('../database');

async function getAstuces() {
    const res = await pool.query('SELECT * FROM astuces ORDER BY date_creation DESC');
    return res.rows;
}

async function creerAstuce(auteur, titre, contenu, langage, code, ownerToken) {
    const res = await pool.query(
        `INSERT INTO astuces (auteur, titre, contenu, langage, code, owner_token) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [auteur, titre, contenu, langage, code, ownerToken]
    );
    return res.rows[0];
}

async function supprimerAstuce(id, ownerToken) {
    const res = await pool.query(
        'DELETE FROM astuces WHERE id = $1 AND owner_token = $2 RETURNING *', 
        [id, ownerToken]
    );
    return res.rows[0];
}

async function ajouterLike(id) {
    const res = await pool.query('UPDATE astuces SET likes = likes + 1 WHERE id = $1 RETURNING likes', [id]);
    return res.rows[0].likes;
}

async function enleverLike(id) {
    const res = await pool.query('UPDATE astuces SET likes = GREATEST(0, likes - 1) WHERE id = $1 RETURNING likes', [id]);
    return res.rows[0].likes;
}

async function ajouterVue(id) {
    const res = await pool.query('UPDATE astuces SET vues = vues + 1 WHERE id = $1 RETURNING vues', [id]);
    return res.rows[0].vues;
}

module.exports = { 
    getAstuces, 
    creerAstuce, 
    supprimerAstuce, 
    ajouterLike, 
    enleverLike, 
    ajouterVue 
};