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
    
    // Détection de l'appareil
    const ua = req.headers['user-agent'] || '';
    const appareil = /mobile|android|iphone|ipad|tablet/i.test(ua) ? '📱 Mobile' : '💻 PC';
    
    // Code de statut avec couleur
    const status = res.statusCode;
    let statusStr = status.toString();
    if (status >= 200 && status < 300) statusStr = `\x1b[32m${status}\x1b[0m`; // Vert
    else if (status >= 300 && status < 400) statusStr = `\x1b[36m${status}\x1b[0m`; // Cyan
    else if (status >= 400 && status < 500) statusStr = `\x1b[33m${status}\x1b[0m`; // Jaune
    else if (status >= 500) statusStr = `\x1b[31m${status}\x1b[0m`; // Rouge
    
    // Nom de la page demandée
    let url = req.originalUrl;
    if (url === '/') url = 'ACCUEIL';
    else if (url.includes('/virt-dev')) url = 'RESULTATS';
    else if (url.includes('/historique')) url = 'HISTORIQUE';
    else if (url.includes('/virtemulator')) url = 'VIRTEMULATOR';
    else if (url.includes('/contact')) url = 'CONTACT';
    else if (url.includes('/api/contact')) url = 'API_CONTACT';
    
    // Temps de réponse
    const temps = tokens['response-time'](req, res) + 'ms';
    
    // Provenance de la visite (Référent)
    let referent = req.headers['referer'] || 'Direct';
    if (referent.includes('whatsapp') || referent.includes('wa.me')) referent = 'WhatsApp';
    else if (referent.includes('google')) referent = 'Google';
    else if (referent.includes('facebook') || referent.includes('fb.me')) referent = 'Facebook';
    else if (referent.includes('virttech.site')) referent = 'Interne';
    
    return `[${heure}] ${appareil} | ${statusStr} | ${url} | 🌍 ${referent} (${temps})`;
});

// On utilise notre format en ignorant les fichiers techniques
app.use(morgan('virttech', {
    skip: function (req, res) {
        return req.originalUrl.includes('/css/') || 
               req.originalUrl.includes('/js/') || 
               req.originalUrl.includes('/logo.png') ||
               req.originalUrl.includes('/favicon.ico') ||
               req.originalUrl.includes('/participants/'); 
    }
}));

// On sert les fichiers statiques (CSS, JS, Images, Participants)
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// ROUTES
// ==========================================

// Route de l'accueil avec compteur
app.get('/', (req, res) => {
    compteurVisitesAccueil++;
    console.log(`👀 Visite n°${compteurVisitesAccueil} sur l'accueil`);
    
    // Envoi de l'alerte toutes les 5 visites
    if (compteurVisitesAccueil >= 5) {
        envoyerAlerteVisites(compteurVisitesAccueil);
        compteurVisitesAccueil = 0; // Remise à zéro après envoi
    }
    
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Redirection de /accueil vers /
app.get('/accueil', (req, res) => res.redirect('/'));

// Pages principales
app.get('/virt-dev', (req, res) => res.sendFile(path.join(__dirname, 'public', 'resultats.html')));
app.get('/virt-dev/resultat', (req, res) => res.sendFile(path.join(__dirname, 'public', 'resultats.html')));
app.get('/historique', (req, res) => res.sendFile(path.join(__dirname, 'public', 'historique.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));

// --- NOUVELLE ROUTE : VIRTEMULATOR ---
app.get('/virtemulator', (req, res) => res.sendFile(path.join(__dirname, 'public', 'virtemulator.html')));

// Routes API
const contactRoutes = require('./routes/contact');
app.use('/api/contact', contactRoutes);

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