require('dotenv').config();

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const { envoyerAlerteVisites } = require('./services/alerteService');
const { initDB } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

let compteurVisitesAccueil = 0;

// DerriÃ¨re un proxy (Render, Heroku...) : req.ip = vraie IP du visiteur
// (nÃ©cessaire pour les limiteurs anti-abus des astuces)
app.set('trust proxy', 1);
app.disable('x-powered-by');

// Middleware
app.use(express.json({ limit: '50kb' })); // assez pour 10 000 caractÃ¨res de code
app.use(express.urlencoded({ extended: true }));

// ==========================================
// LOGS INTELLIGENTS
// ==========================================
morgan.format('virttech', (tokens, req, res) => {
    const now = new Date();
    const heure = now.getHours().toString().padStart(2, '0') + 'h' + now.getMinutes().toString().padStart(2, '0');
    const ua = req.headers['user-agent'] || '';
    const appareil = /mobile|android|iphone|ipad|tablet/i.test(ua) ? 'ðŸ“± Mobile' : 'ðŸ’» PC';
    const status = res.statusCode;
    let statusStr = status.toString();
    if (status >= 200 && status < 300) statusStr = `\x1b[32m${status}\x1b[0m`;
    else if (status >= 300 && status < 400) statusStr = `\x1b[36m${status}\x1b[0m`;
    else if (status >= 400 && status < 500) statusStr = `\x1b[33m${status}\x1b[0m`;
    else if (status >= 500) statusStr = `\x1b[31m${status}\x1b[0m`;

    let url = req.originalUrl;
    if (url === '/') url = 'ACCUEIL';
    // Les routes API sont testÃ©es AVANT les pages (sinon '/api/contact' Ã©tait vu comme 'CONTACT')
    else if (url.includes('/api/contact')) url = 'API_CONTACT';
    else if (url.includes('/api/shorten')) url = 'API_SHORTEN';
    else if (url.includes('/api/astuces')) url = 'API_ASTUCES';
    else if (url.includes('/api/activites')) url = 'API_ACTIVITES';
    else if (url.includes('/api/ia')) url = 'API_IA';
    else if (url.includes('/virt-dev')) url = 'RESULTATS';
    else if (url.includes('/historique')) url = 'HISTORIQUE';
    else if (url.includes('/virtemulator')) url = 'VIRTEMULATOR';
    else if (url.includes('/contact')) url = 'CONTACT';
    else if (url.includes('/astuces')) url = 'PAGE_ASTUCES';
    else if (url.includes('/transformlink')) url = 'TRANSFORMLINK';
    else url = 'SHORTLINK : ' + url; // Si c'est une redirection

    const temps = tokens['response-time'](req, res) + 'ms';
    return `[${heure}] ${appareil} | ${statusStr} | ${url} (${temps})`;
});

app.use(morgan('virttech', {
    skip: function (req, res) {
        return req.originalUrl.includes('/css/') || 
               req.originalUrl.includes('/js/') || 
               req.originalUrl.includes('/logo.png') ||
               req.originalUrl.includes('/favicon.ico') ||
               req.originalUrl.includes('/participants/');
    }
}));

// Fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// ROUTES DU SITE
// ==========================================

// Accueil avec compteur
app.get('/', (req, res) => {
    compteurVisitesAccueil++;
    console.log(`ðŸ‘€ Visite nÂ°${compteurVisitesAccueil} sur l'accueil`);
    if (compteurVisitesAccueil >= 5) {
        envoyerAlerteVisites(compteurVisitesAccueil);
        compteurVisitesAccueil = 0;
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/accueil', (req, res) => res.redirect('/'));
app.get('/virt-dev', (req, res) => res.sendFile(path.join(__dirname, 'public', 'resultats.html')));
app.get('/virt-dev/resultat', (req, res) => res.sendFile(path.join(__dirname, 'public', 'resultats.html')));
app.get('/historique', (req, res) => res.sendFile(path.join(__dirname, 'public', 'historique.html')));
app.get('/cours', (req, res) => res.sendFile(path.join(__dirname, 'public', 'cours.html')));
app.get('/admin-cours', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin-cours.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));
app.get('/virtemulator', (req, res) => res.sendFile(path.join(__dirname, 'public', 'virtemulator.html')));
app.get('/virtemulator-pc', (req, res) => res.sendFile(path.join(__dirname, 'public', 'virtemulator-pc.html')));
app.get('/transformlink', (req, res) => res.sendFile(path.join(__dirname, 'public', 'transformlink.html')));

app.get('/hommage/mrAttoubre', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'hommage.html'));
});
// Page Astuces
app.get('/astuces', (req, res) => res.sendFile(path.join(__dirname, 'public', 'astuces.html')));

// Pages Ã©ditoriales
app.get('/actualites', (req, res) => res.sendFile(path.join(__dirname, 'public', 'actualites.html')));
app.get('/apropos', (req, res) => res.sendFile(path.join(__dirname, 'public', 'apropos.html')));

// ==========================================
// ROUTES API
// ==========================================
const contactRoutes = require('./routes/contact');
app.use('/api/contact', contactRoutes);

// Astuces AVANT le routeur de liens raccourcis montÃ© sur '/'
// (ainsi aucune route gÃ©nÃ©rique ne peut intercepter /api/astuces/...)
const astucesRoutes = require('./routes/astuces');
const coursRoutes = require('./routes/cours');
app.use('/api/astuces', astucesRoutes);
app.use('/api/cours', coursRoutes);

// Compteur de clics Â« Run Â» de la page Historique
const activitesRoutes = require('./routes/activites');
app.use('/api/activites', activitesRoutes);

// Assistant IA (mode texte)
const iaRoutes = require('./routes/ia');
app.use('/api/ia', iaRoutes);

const shortenRoutes = require('./routes/shorten');
app.use('/api/shorten', shortenRoutes);
app.use('/', shortenRoutes);

// ==========================================
// GESTION DES ERREURS 404
// ==========================================
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});



// ==========================================
// GESTION DES ERREURS (JSON invalide, corps trop gros, imprÃ©vus)
// ==========================================
app.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ succes: false, message: "Contenu trop volumineux." });
    }
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ succes: false, message: "RequÃªte invalide." });
    }
    console.error('âŒ Erreur non gÃ©rÃ©e :', err);
    res.status(500).json({ succes: false, message: "Erreur serveur." });
});

// ==========================================
// DÃ‰MARRAGE
// ==========================================
initDB().then(() => {
    // Purge des Ã©changes IA de plus de 90 jours (au dÃ©marrage, puis 1 fois par jour)
    const { purger } = require('./services/iaEchangeService');
    const purgerEchanges = () => {
        purger(90)
            .then((n) => { if (n > 0) console.log(`ðŸ§¹ ${n} Ã©change(s) IA de plus de 90 jours supprimÃ©(s).`); })
            .catch((e) => console.error("Purge IA impossible :", e.message));
    };
    purgerEchanges();
    setInterval(purgerEchanges, 24 * 60 * 60 * 1000).unref();

    app.listen(PORT, () => {
        console.log(`Le serveur VirtTech tourne sur http://localhost:${PORT}`);
    });

    // Astuces de dÃ©marrage signÃ©es VirtTech (ajoutÃ©es une seule fois)
    require('./services/astucesSeed').semer()
        .catch((e) => console.error("[astuces] semis impossible :", e.message));
});