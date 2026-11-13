require('dotenv').config();

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const { envoyerAlerteVisites } = require('./services/alerteService');
const { initDB } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

let compteurVisitesAccueil = 0;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// LOGS INTELLIGENTS
// ==========================================
morgan.format('virttech', (tokens, req, res) => {
    const now = new Date();
    const heure = now.getHours().toString().padStart(2, '0') + 'h' + now.getMinutes().toString().padStart(2, '0');
    const ua = req.headers['user-agent'] || '';
    const appareil = /mobile|android|iphone|ipad|tablet/i.test(ua) ? '📱 Mobile' : '💻 PC';
    const status = res.statusCode;
    let statusStr = status.toString();
    if (status >= 200 && status < 300) statusStr = `\x1b[32m${status}\x1b[0m`;
    else if (status >= 300 && status < 400) statusStr = `\x1b[36m${status}\x1b[0m`;
    else if (status >= 400 && status < 500) statusStr = `\x1b[33m${status}\x1b[0m`;
    else if (status >= 500) statusStr = `\x1b[31m${status}\x1b[0m`;

    let url = req.originalUrl;
    if (url === '/') url = 'ACCUEIL';
    else if (url.includes('/virt-dev')) url = 'RESULTATS';
    else if (url.includes('/historique')) url = 'HISTORIQUE';
    else if (url.includes('/virtemulator')) url = 'VIRTEMULATOR';
    else if (url.includes('/contact')) url = 'CONTACT';
    else if (url.includes('/api/contact')) url = 'API_CONTACT';
    else if (url.includes('/api/shorten')) url = 'API_SHORTEN';
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
    console.log(`👀 Visite n°${compteurVisitesAccueil} sur l'accueil`);
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
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));
app.get('/virtemulator', (req, res) => res.sendFile(path.join(__dirname, 'public', 'virtemulator.html')));
app.get('/transformlink', (req, res) => res.sendFile(path.join(__dirname, 'public', 'transformlink.html')));
// ROUTES API
const contactRoutes = require('./routes/contact');
app.use('/api/contact', contactRoutes);

// ROUTES DU RACCOURCISSEUR
const shortenRoutes = require('./routes/shorten');
app.use('/api/shorten', shortenRoutes); // Route POST pour créer
app.use('/', shortenRoutes);           // Route GET pour rediriger (ex: /test123)

// ==========================================
// GESTION DES ERREURS 404
// ==========================================
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// ==========================================
// DÉMARRAGE
// ==========================================
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Le serveur VirtTech tourne sur http://localhost:${PORT}`);
    });
});