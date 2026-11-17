const express = require('express');
const router = express.Router();
const service = require('../services/activiteService');

// Enveloppe commune : 400/404 viennent du service, le reste = 500 sans détails
const route = (fn) => async (req, res) => {
    try {
        await fn(req, res);
    } catch (error) {
        const status = error.status || 500;
        if (status === 500) console.error('[activites]', error);
        res.status(status).json({
            succes: false,
            message: status === 500 ? "Erreur serveur. Réessayez plus tard." : error.message
        });
    }
};

// GET /api/activites/stats → { virtdev: 3, arborescence: 1, ... }
router.get('/stats', route(async (req, res) => {
    res.json({ succes: true, data: await service.getStats() });
}));

// POST /api/activites/:slug/run → incrémente et renvoie le nouveau total
router.post('/:slug/run', route(async (req, res) => {
    const clics = await service.enregistrerClic(req.params.slug);
    res.json({ succes: true, slug: req.params.slug, clics });
}));

module.exports = router;
