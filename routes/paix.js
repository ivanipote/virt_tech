const express = require('express');
const router = express.Router();
const { pool } = require('../database'); // Nécessaire pour la route DELETE
const { ajouterHistoire, getHistoires, getMesHistoires, likerHistoire } = require('../services/paixService');

// GET /api/paix/histoires -> Récupérer les histoires
router.get('/histoires', async (req, res) => {
    const deviceId = req.query.device_id;
    const filtre = req.query.filtre;

    if (!deviceId) return res.status(400).json({ succes: false, message: "Device ID manquant." });

    try {
        let histoires;
        if (filtre === 'miennes') {
            histoires = await getMesHistoires(deviceId);
        } else {
            histoires = await getHistoires(deviceId);
        }
        res.json({ succes: true, data: histoires });
    } catch (error) {
        res.status(500).json({ succes: false, message: error.message });
    }
});

// POST /api/paix/histoires -> Ajouter une histoire
router.post('/histoires', async (req, res) => {
    const { contenu, device_id, auteur } = req.body;

    if (!contenu || !device_id) {
        return res.status(400).json({ succes: false, message: "Contenu ou device ID manquant." });
    }

    try {
        const nouvelleHistoire = await ajouterHistoire(contenu, device_id, auteur || 'Anonyme');
        res.json({ succes: true, data: nouvelleHistoire });
    } catch (error) {
        res.status(500).json({ succes: false, message: error.message });
    }
});

// POST /api/paix/like/:id -> Liker une histoire
router.post('/like/:id', async (req, res) => {
    const histoireId = req.params.id;
    const { device_id } = req.body;

    if (!device_id) return res.status(400).json({ succes: false, message: "Device ID manquant." });

    try {
        const nouveauTotal = await likerHistoire(histoireId, device_id);
        res.json({ succes: true, likes: nouveauTotal });
    } catch (error) {
        res.status(400).json({ succes: false, message: error.message });
    }
});

// DELETE /api/paix/histoires/:id -> Supprimer une histoire
router.delete('/histoires/:id', async (req, res) => {
    const histoireId = req.params.id;
    const { device_id } = req.body;

    if (!device_id) return res.status(400).json({ succes: false, message: "Device ID manquant." });

    try {
        // 1. On vérifie que l'histoire existe et qu'elle appartient à cet appareil
        const check = await pool.query('SELECT device_id FROM histoires WHERE id = $1', [histoireId]);
        
        if (check.rows.length === 0) {
            return res.status(404).json({ succes: false, message: "Histoire introuvable." });
        }
        if (check.rows[0].device_id !== device_id) {
            return res.status(403).json({ succes: false, message: "Vous ne pouvez pas supprimer cette histoire." });
        }

        // 2. On supprime l'histoire
        await pool.query('DELETE FROM histoires WHERE id = $1', [histoireId]);
        
        res.json({ succes: true, message: "Histoire supprimée avec succès." });
    } catch (error) {
        res.status(500).json({ succes: false, message: error.message });
    }
});

module.exports = router;