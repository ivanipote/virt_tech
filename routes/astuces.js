const express = require('express');
const router = express.Router();
const { getAstuces, creerAstuce, supprimerAstuce, ajouterLike, enleverLike, ajouterVue } = require('../services/astuceService');

// GET
router.get('/', async (req, res) => {
    try {
        const astuces = await getAstuces();
        res.json({ succes: true, data: astuces });
    } catch (error) {
        res.status(500).json({ succes: false, message: error.message });
    }
});

// POST
router.post('/', async (req, res) => {
    const { auteur, titre, contenu, langage, code, ownerToken } = req.body;
    if (!auteur || !titre || !contenu || !ownerToken) {
        return res.status(400).json({ succes: false, message: "Champs manquants (dont le token)." });
    }
    try {
        const nouvelleAstuce = await creerAstuce(auteur, titre, contenu, langage, code, ownerToken);
        res.json({ succes: true, data: nouvelleAstuce });
    } catch (error) {
        res.status(500).json({ succes: false, message: error.message });
    }
});

// DELETE (Vérification du token)
router.delete('/:id', async (req, res) => {
    const { ownerToken } = req.body;
    try {
        const supprimee = await supprimerAstuce(req.params.id, ownerToken);
        if (supprimee) {
            res.json({ succes: true, message: "Astuce supprimée." });
        } else {
            res.status(403).json({ succes: false, message: "Non autorisé (ce n'est pas votre astuce)." });
        }
    } catch (error) {
        res.status(500).json({ succes: false, message: error.message });
    }
});

// Likes, Unlikes, Vues
router.post('/:id/like', async (req, res) => {
    try {
        const likes = await ajouterLike(req.params.id);
        res.json({ succes: true, likes });
    } catch (error) { res.status(500).json({ succes: false, message: error.message }); }
});

router.post('/:id/unlike', async (req, res) => {
    try {
        const likes = await enleverLike(req.params.id);
        res.json({ succes: true, likes });
    } catch (error) { res.status(500).json({ succes: false, message: error.message }); }
});

router.post('/:id/vue', async (req, res) => {
    try {
        const vues = await ajouterVue(req.params.id);
        res.json({ succes: true, vues });
    } catch (error) { res.status(500).json({ succes: false, message: error.message }); }
});

module.exports = router;