const express = require('express');
const router = express.Router();
const { 
    getAstuces, 
    creerAstuce, 
    supprimerAstuce, 
    ajouterLike, 
    enleverLike, 
    ajouterVue 
} = require('../services/astuceService');

// GET toutes les astuces
router.get('/', async (req, res) => {
    try {
        const astuces = await getAstuces();
        res.json({ succes: true, data: astuces });
    } catch (error) {
        res.status(500).json({ succes: false, message: error.message });
    }
});

// POST créer une astuce
router.post('/', async (req, res) => {
    const { auteur, titre, contenu, langage, code } = req.body;
    if (!auteur || !titre || !contenu) {
        return res.status(400).json({ succes: false, message: "Champs manquants." });
    }
    try {
        const nouvelleAstuce = await creerAstuce(auteur, titre, contenu, langage, code);
        res.json({ succes: true, data: nouvelleAstuce });
    } catch (error) {
        res.status(500).json({ succes: false, message: error.message });
    }
});

// DELETE supprimer une astuce
router.delete('/:id', async (req, res) => {
    try {
        const supprimee = await supprimerAstuce(req.params.id);
        if (supprimee) res.json({ succes: true, message: "Astuce supprimée." });
        else res.status(403).json({ succes: false, message: "Non autorisé." });
    } catch (error) {
        res.status(500).json({ succes: false, message: error.message });
    }
});

// POST ajouter un like
router.post('/:id/like', async (req, res) => {
    try {
        const likes = await ajouterLike(req.params.id);
        res.json({ succes: true, likes });
    } catch (error) {
        res.status(500).json({ succes: false, message: error.message });
    }
});

// POST enlever un like
router.post('/:id/unlike', async (req, res) => {
    try {
        const likes = await enleverLike(req.params.id);
        res.json({ succes: true, likes });
    } catch (error) {
        res.status(500).json({ succes: false, message: error.message });
    }
});

// POST ajouter une vue
router.post('/:id/vue', async (req, res) => {
    try {
        const vues = await ajouterVue(req.params.id);
        res.json({ succes: true, vues });
    } catch (error) {
        res.status(500).json({ succes: false, message: error.message });
    }
});

module.exports = router;