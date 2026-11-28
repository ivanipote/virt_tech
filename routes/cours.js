// --- routes/cours.js ---
// API des cours : lecture publique, Ã©criture rÃ©servÃ©e Ã  l'administration.

const express = require('express');
const router = express.Router();
const service = require('../services/coursService');

function admin(req, res, next) {
    const attendu = process.env.ADMIN_TOKEN;

    if (!attendu) {
        return res.status(503).json({ succes: false, message: "Administration non configurÃ©e (ADMIN_TOKEN)." });
    }

    if (req.get('x-admin-token') !== attendu) {
        return res.status(401).json({ succes: false, message: "Jeton administrateur invalide." });
    }

    next();
}

function gerer(fonction) {
    return async function (req, res) {
        try {
            const resultat = await fonction(req);
            res.json({ succes: true, ...resultat });
        } catch (e) {
            const status = e.status || 500;
            if (status >= 500) console.error("[cours]", e.message);
            res.status(status).json({ succes: false, message: e.message });
        }
    };
}

router.get('/', gerer(async () => {
    return { cours: await service.lister() };
}));

router.get('/admin/tous', admin, gerer(async () => {
    return { cours: await service.listerTous() };
}));

router.get('/:slug', gerer(async (req) => {
    return { cours: await service.lire(req.params.slug) };
}));

router.post('/:slug/vue', gerer(async (req) => {
    return await service.ajouterVue(req.params.slug);
}));

router.post('/', admin, gerer(async (req) => {
    return { cours: await service.creer(req.body || {}) };
}));

router.put('/:slug', admin, gerer(async (req) => {
    return { cours: await service.modifier(req.params.slug, req.body || {}) };
}));

router.delete('/:slug', admin, gerer(async (req) => {
    return { cours: await service.supprimer(req.params.slug) };
}));

module.exports = router;
