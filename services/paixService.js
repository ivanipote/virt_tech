const { pool } = require('../database');

// Ajouter une histoire
async function ajouterHistoire(contenu, deviceId, auteur) {
    const res = await pool.query(
        'INSERT INTO histoires (contenu, device_id, auteur) VALUES ($1, $2, $3) RETURNING *',
        [contenu, deviceId, auteur]
    );
    return res.rows[0];
}

// Récupérer toutes les histoires (avec le statut de like pour cet appareil)
async function getHistoires(deviceId) {
    const res = await pool.query(`
        SELECT h.*, 
        EXISTS(SELECT 1 FROM likes_histoires l WHERE l.histoire_id = h.id AND l.device_id = $1) as a_deja_like
        FROM histoires h 
        ORDER BY h.created_at DESC
    `, [deviceId]);
    return res.rows;
}

// Récupérer uniquement les histoires de cet appareil
async function getMesHistoires(deviceId) {
    const res = await pool.query(
        'SELECT * FROM histoires WHERE device_id = $1 ORDER BY created_at DESC',
        [deviceId]
    );
    return res.rows;
}

// Ajouter un like
async function likerHistoire(histoireId, deviceId) {
    try {
        // 1. On enregistre le like
        await pool.query(
            'INSERT INTO likes_histoires (histoire_id, device_id) VALUES ($1, $2)',
            [histoireId, deviceId]
        );
        // 2. On incrémente le compteur sur l'histoire
        const res = await pool.query(
            'UPDATE histoires SET likes = likes + 1 WHERE id = $1 RETURNING likes',
            [histoireId]
        );
        return res.rows[0].likes;
    } catch (err) {
        if (err.code === '23505') { // Code d'erreur si le like existe déjà
            throw new Error("Vous avez déjà aimé cette histoire.");
        }
        throw err;
    }
}

module.exports = { ajouterHistoire, getHistoires, getMesHistoires, likerHistoire };