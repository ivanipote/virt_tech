require('dotenv').config();

const express = require('express');
const path = require('path');
const morgan = require('morgan'); // Pour les logs

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour lire le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// CONFIGURATION DES LOGS INTELLIGENTS
// ==========================================

// On crée un format personnalisé pour Morgan
morgan.format('virttech', (tokens, req, res) => {
    const now = new Date();
    const heure = now.getHours().toString().padStart(2, '0') + 'h' + now.getMinutes().toString().padStart(2, '0');
    
    // Détection de l'appareil
    const ua = req.headers['user-agent'] || '';
    const appareil = /mobile|android|iphone|ipad|tablet/i.test(ua) ? '📱 Mobile' : '💻 PC';
    
    // Code de statut avec couleur (Vert = OK, Jaune = Erreur client, Rouge = Erreur serveur)
    const status = res.statusCode;
    let statusStr = status.toString();
    if (status >= 200 && status < 300) statusStr = `\x1b[32m${status}\x1b[0m`; // Vert
    else if (status >= 300 && status < 400) statusStr = `\x1b[36m${status}\x1b[0m`; // Cyan
    else if (status >= 400 && status < 500) statusStr = `\x1b[33m${status}\x1b[0m`; // Jaune
    else if (status >= 500) statusStr = `\x1b[31m${status}\x1b[0m`; // Rouge
    
    // URL demandée
    let url = req.originalUrl;
    if (url === '/') url = 'ACCUEIL';
    else if (url.includes('/virt-dev')) url = 'RESULTATS';
    else if (url.includes('/historique')) url = 'HISTORIQUE';
    else if (url.includes('/contact')) url = 'CONTACT';
    
    // Temps de réponse
    const temps = tokens['response-time'](req, res) + 'ms';
    
    return `[${heure}] ${appareil} | ${statusStr} | ${url} (${temps})`;
});

// On utilise notre format personnalisé et on ignore les fichiers techniques (CSS, JS, Images)
app.use(morgan('virttech', {
    skip: function (req, res) {
        return req.originalUrl.includes('/css/') || 
               req.originalUrl.includes('/js/') || 
               req.originalUrl.includes('/logo.png') ||
               req.originalUrl.includes('/favicon.ico');
    }
}));

// ==========================================
// SUITE DU SERVEUR
// ==========================================

// On sert les fichiers statiques (CSS, JS, Images)
app.use(express.static(path.join(__dirname, 'public')));

// Raccourci pour envoyer les fichiers HTML
const sendPage = (file) => (req, res) => {
    res.sendFile(path.join(__dirname, 'public', file));
};

// Routes
app.get('/', sendPage('index.html'));
app.get('/accueil', sendPage('index.html'));
app.get('/virt-dev', sendPage('resultats.html'));
app.get('/virt-dev/resultat', sendPage('resultats.html'));
app.get('/historique', sendPage('historique.html'));
app.get('/contact', sendPage('contact.html'));

// Routes API
const contactRoutes = require('./routes/contact');
app.use('/api/contact', contactRoutes);

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Démarrage
app.listen(PORT, () => {
    console.log(`Le serveur VirtTech tourne sur http://localhost:${PORT}`);
    console.log(`Mode : ${process.env.NODE_ENV || 'développement'}`);
});