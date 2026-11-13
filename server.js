require('dotenv').config();

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const { envoyerAlerteVisites } = require('./services/alerteService');

const app = express();
const PORT = process.env.PORT || 3000;

// Compteur global pour la page d'accueil
let compteurVisitesAccueil = 0;

// Middleware pour lire le JSON et les formulaires
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// CONFIGURATION DES LOGS INTELLIGENTS
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
    else if (url.includes('/api/download')) url = 'API_DOWNLOAD';
    else if (url.includes('/test-download')) url = 'TEST_DOWNLOAD';
    
    const temps = tokens['response-time'](req, res) + 'ms';
    
    let referent = req.headers['referer'] || 'Direct';
    if (referent.includes('whatsapp') || referent.includes('wa.me')) referent = 'WhatsApp';
    else if (referent.includes('google')) referent = 'Google';
    else if (referent.includes('facebook') || referent.includes('fb.me')) referent = 'Facebook';
    else if (referent.includes('virttech.site')) referent = 'Interne';
    
    return `[${heure}] ${appareil} | ${statusStr} | ${url} | 🌍 ${referent} (${temps})`;
});

app.use(morgan('virttech', {
    skip: function (req, res) {
        return req.originalUrl.includes('/css/') || 
               req.originalUrl.includes('/js/') || 
               req.originalUrl.includes('/logo.png') ||
               req.originalUrl.includes('/favicon.ico') ||
               req.originalUrl.includes('/participants/') ||
               req.originalUrl.includes('/downloads/');
    }
}));

// On sert les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));
app.use('/downloads', express.static(path.join(__dirname, 'public', 'downloads')));

// ==========================================
// ROUTES
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

// Pages principales
app.get('/virt-dev', (req, res) => res.sendFile(path.join(__dirname, 'public', 'resultats.html')));
app.get('/virt-dev/resultat', (req, res) => res.sendFile(path.join(__dirname, 'public', 'resultats.html')));
app.get('/historique', (req, res) => res.sendFile(path.join(__dirname, 'public', 'historique.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));
app.get('/virtemulator', (req, res) => res.sendFile(path.join(__dirname, 'public', 'virtemulator.html')));

// Test de téléchargement
app.get('/test-download', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'test-download.html'));
});

// Routes API
const contactRoutes = require('./routes/contact');
app.use('/api/contact', contactRoutes);

const downloadRoutes = require('./routes/download');
app.use('/api/download', downloadRoutes);

// ==========================================
// GESTION DES ERREURS 404
// ==========================================
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// ==========================================
// DÉMARRAGE
// ==========================================
app.listen(PORT, () => {
    console.log(`Le serveur VirtTech tourne sur http://localhost:${PORT}`);
    console.log(`Mode : ${process.env.NODE_ENV || 'développement'}`);
});