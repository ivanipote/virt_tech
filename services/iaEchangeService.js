const { pool } = require('../database');

// Enregistre un échange (question + réponse + infos technique/appareil)
async function enregistrer(e) {
    const res = await pool.query(
        `INSERT INTO ia_echanges
            (conversation_id, question, reponse, modele,
             tokens_entree, tokens_sortie, latence_ms,
             appareil_type, appareil_marque, appareil_modele,
             os, navigateur, langue, ip_hash)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         RETURNING id`,
        [
            e.conversationId || null,
            e.question,
            e.reponse,
            e.modele || null,
            e.tokensEntree || null,
            e.tokensSortie || null,
            e.latence || null,
            e.type || null,
            e.marque || null,
            e.modeleAppareil || null,
            e.os || null,
            e.navigateur || null,
            e.langue || null,
            e.ipHash || null
        ]
    );

    return res.rows[0];
}

// Note un échange : 1 (utile), -1 (pas utile), 0 (annulé)
async function noter(id, note) {
    const res = await pool.query(
        `UPDATE ia_echanges
         SET note = $1, note_le = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING id`,
        [note, id]
    );

    return res.rowCount > 0;
}

// Supprime les échanges plus vieux que N jours (90 par défaut)
async function purger(jours = 90) {
    const res = await pool.query(
        `DELETE FROM ia_echanges WHERE cree_le < NOW() - ($1 || ' days')::interval`,
        [String(jours)]
    );

    return res.rowCount;
}

module.exports = { enregistrer, noter, purger };
