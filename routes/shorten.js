const express = require('express');
const router = express.Router();
const { creerLien, trouverLien } = require('../services/linkService');

// Créer un lien
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

// Redirection : quand quelqu'un tape /mon-projet
router.get('/:code', async (req, res) => {
    const { code } = req.params;
    
    try {
        const url = await trouverLien(code);
        if (url) {
            // Si le lien existe, on redirige
            res.redirect(301, url);
        } else {
            // Sinon, on passe au middleware suivant (qui affichera la 404)
            res.status(404).sendFile('404.html', { root: './public' });
        }
    } catch (error) {
        res.status(500).send("Erreur serveur.");
    }
});

module.exports = router;