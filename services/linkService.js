const { pool } = require('../database');

// Créer un lien
async function creerLien(urlOriginal, code) {
    try {
        const res = await pool.query(
            'INSERT INTO links (short_code, original_url) VALUES ($1, $2) RETURNING *',
            [code, urlOriginal]
        );
        return res.rows[0];
    } catch (err) {
        if (err.code === '23505') {
            throw new Error("Ce code existe déjà.");
        }
        throw err;
    }
}

// Trouver un lien par son code
async function trouverLien(code) {
    const res = await pool.query('SELECT original_url FROM links WHERE short_code = $1', [code]);
    if (res.rows.length === 0) return null;
    return res.rows[0].original_url;
}

module.exports = { creerLien, trouverLien };