const { pool } = require('../database');

// Récupérer toutes les astuces
async function getAstuces() {
    const res = await pool.query('SELECT * FROM astuces ORDER BY date_creation DESC');
    return res.rows;
}

// Créer une astuce
async function creerAstuce(auteur, titre, contenu, langage, code) {
    const res = await pool.query(
        `INSERT INTO astuces (auteur, titre, contenu, langage, code, is_mine) 
         VALUES ($1, $2, $3, $4, $5, TRUE) RETURNING *`,
        [auteur, titre, contenu, langage, code]
    );
    return res.rows[0];
}

// Supprimer une astuce (uniquement si is_mine est true pour cette démo)
async function supprimerAstuce(id) {
    const res = await pool.query('DELETE FROM astuces WHERE id = $1 AND is_mine = TRUE RETURNING *', [id]);
    return res.rows[0];
}

// Ajouter un like
async function ajouterLike(id) {
    const res = await pool.query('UPDATE astuces SET likes = likes + 1 WHERE id = $1 RETURNING likes', [id]);
    return res.rows[0].likes;
}

// Enlever un like
async function enleverLike(id) {
    const res = await pool.query('UPDATE astuces SET likes = GREATEST(0, likes - 1) WHERE id = $1 RETURNING likes', [id]);
    return res.rows[0].likes;
}

// Ajouter une vue
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