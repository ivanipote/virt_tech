const express = require('express');
const router = express.Router();
const service = require('../services/astuceService');

// ---------------------------------------------------------------------
// Utilitaires
// ---------------------------------------------------------------------

// Le jeton du visiteur arrive dans l'en-tête "x-visiteur-token" (jamais dans l'URL)
function visiteur(req) {
    const t = req.get('x-visiteur-token');
    return typeof t === 'string' ? t.trim().slice(0, 255) : '';
}

// Enveloppe chaque route : gère les erreurs avec le bon code HTTP
// (400/404 viennent du service, le reste = 500 sans exposer les détails internes)
const route = (fn) => async (req, res) => {
    try {
        await fn(req, res);
    } catch (error) {
        const status = error.status || 500;
        if (status === 500) console.error('[astuces]', error);
        res.status(status).json({
            succes: false,
            message: status === 500 ? "Erreur serveur. Réessayez plus tard." : error.message
        });
    }
};

// Limiteur simple en mémoire (par IP). Se remet à zéro au redémarrage.
// Nécessite app.set('trust proxy', 1) dans server.js si tu es derrière un proxy (Render, Heroku...).
function limiter({ fenetreMs, max, message }) {
    const compteurs = new Map();
    setInterval(() => {
        const maintenant = Date.now();
        for (const [cle, e] of compteurs) if (e.fin <= maintenant) compteurs.delete(cle);
    }, 60000).unref();

    return (req, res, next) => {
        const maintenant = Date.now();
        let e = compteurs.get(req.ip);
        if (!e || e.fin <= maintenant) {
            e = { n: 0, fin: maintenant + fenetreMs };
            compteurs.set(req.ip, e);
        }
        e.n++;
        if (e.n > max) {
            res.set('Retry-After', Math.ceil((e.fin - maintenant) / 1000));
            return res.status(429).json({ succes: false, message });
        }
        next();
    };
}

const limitePublication = limiter({ fenetreMs: 10 * 60 * 1000, max: 5, message: "Trop de publications. Réessayez dans quelques minutes." });
const limiteModification = limiter({ fenetreMs: 10 * 60 * 1000, max: 30, message: "Trop de modifications. Réessayez dans quelques minutes." });
const limiteInteraction = limiter({ fenetreMs: 60 * 1000, max: 60, message: "Trop d'actions. Ralentissez un peu." });

// Les réponses dépendent du visiteur (est_proprietaire, a_like) : pas de cache
router.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

// ---------------------------------------------------------------------
// LECTURE
// ---------------------------------------------------------------------

// GET /api/astuces?recherche=&langage=&niveau=&tri=recentes|populaires|vues&mes=1&page=1&limite=6
router.get('/', route(async (req, res) => {
    const { recherche, langage, niveau, tri, page, limite } = req.query;
    const mes = ['1', 'true'].includes(String(req.query.mes));
    const resultat = await service.getAstuces({
        visiteur: visiteur(req), recherche, langage, niveau, tri, mes, page, limite
    });
    res.json({
        succes: true,
        data: resultat.astuces,
        total: resultat.total,
        page: resultat.page,
        limite: resultat.limite,
        aPlus: resultat.page * resultat.limite < resultat.total
    });
}));

// ⚠️ /stats et /du-jour doivent rester AVANT /:id
router.get('/stats', route(async (req, res) => {
    res.json({ succes: true, data: await service.getStats() });
}));

// Astuce du jour : la première astuce publiée depuis 00h00 (voir astuceService.getAstuceDuJour)
router.get('/du-jour', route(async (req, res) => {
    res.json({ succes: true, data: await service.getAstuceDuJour(visiteur(req)) });
}));

router.get('/:id', route(async (req, res) => {
    const astuce = await service.getAstuceParId(req.params.id, visiteur(req));
    if (!astuce) return res.status(404).json({ succes: false, message: "Astuce introuvable." });
    res.json({ succes: true, data: astuce });
}));

// ---------------------------------------------------------------------
// ÉCRITURE
// ---------------------------------------------------------------------

// POST /api/astuces  (corps : auteur, titre, contenu, langage, niveau, code)
router.post('/', limitePublication, route(async (req, res) => {
    const astuce = await service.creerAstuce(req.body || {}, visiteur(req));
    res.status(201).json({ succes: true, data: astuce });
}));

// PUT /api/astuces/:id  (réservé au propriétaire)
router.put('/:id', limiteModification, route(async (req, res) => {
    const astuce = await service.modifierAstuce(req.params.id, req.body || {}, visiteur(req));
    if (!astuce) {
        return res.status(403).json({ succes: false, message: "Non autorisé (astuce introuvable ou ce n'est pas la vôtre)." });
    }
    res.json({ succes: true, data: astuce });
}));

// DELETE /api/astuces/:id  (réservé au propriétaire, jeton dans l'en-tête)
router.delete('/:id', limiteModification, route(async (req, res) => {
    const supprimee = await service.supprimerAstuce(req.params.id, visiteur(req));
    if (!supprimee) {
        return res.status(403).json({ succes: false, message: "Non autorisé (astuce introuvable ou ce n'est pas la vôtre)." });
    }
    res.json({ succes: true, message: "Astuce supprimée." });
}));

// ---------------------------------------------------------------------
// LIKES & VUES (un seul par appareil, garanti par la base)
// ---------------------------------------------------------------------

router.post('/:id/like', limiteInteraction, route(async (req, res) => {
    const likes = await service.ajouterLike(req.params.id, visiteur(req));
    res.json({ succes: true, likes, aLike: true });
}));

router.post('/:id/unlike', limiteInteraction, route(async (req, res) => {
    const likes = await service.enleverLike(req.params.id, visiteur(req));
    res.json({ succes: true, likes, aLike: false });
}));

router.post('/:id/vue', limiteInteraction, route(async (req, res) => {
    const vues = await service.ajouterVue(req.params.id, visiteur(req));
    res.json({ succes: true, vues });
}));

module.exports = router;