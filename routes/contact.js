const express = require('express');
const router = express.Router();
const { envoyerEmailContact } = require('../services/emailService');

// Route POST pour le formulaire de contact
router.post('/', async (req, res) => {
    const { nom, email, message } = req.body;

    // Vérification des champs
    if (!nom || !email || !message) {
        return res.status(400).json({ succes: false, message: "Tous les champs sont obligatoires." });
    }

    try {
        const resultat = await envoyerEmailContact(nom, email, message);
        res.status(200).json(resultat);
    } catch (error) {
        res.status(500).json({ succes: false, message: error.message });
    }
});

module.exports = router;