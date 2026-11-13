const express = require('express');
const router = express.Router();
const { creerLien, trouverLien } = require('../services/linkService');

// POST /api/shorten/test -> créer un lien
router.post('/test', async (req, res) => {
    try {
        // On crée un lien de test
        const lien = await creerLien("https://github.com/ivanipote", "test123");
        
        res.json({ 
            succes: true, 
            message: "Lien inséré avec succès !",
            data: lien 
        });
    } catch (error) {
        res.status(500).json({ succes: false, message: error.message });
    }
});

// GET /:code -> redirection
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