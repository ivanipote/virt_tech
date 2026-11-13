const express = require('express');
const router = express.Router();
const { creerLien, trouverLien } = require('../services/linkService');

// C'est CETTE route qui est appelée par ton formulaire
router.post('/', async (req, res) => {
    const { url, code } = req.body;

    if (!url) {
        return res.status(400).json({ succes: false, message: "L'URL est requise." });
    }

    try {
        const lien = await creerLien(url, code || null);
        
        res.json({ 
            succes: true, 
            short_url: `https://virttech.site/${lien.short_code}`,
            original_url: lien.original_url
        });
    } catch (error) {
        res.status(400).json({ succes: false, message: error.message });
    }
});

// Route pour la redirection (le GET /l/code)
router.get('/:code', async (req, res) => {
    const { code } = req.params;
    try {
        const url = await trouverLien(code);
        if (url) {
            res.redirect(301, url);
        } else {
            res.status(404).send("Lien introuvable.");
        }
    } catch (error) {
        res.status(500).send("Erreur serveur.");
    }
});

module.exports = router;