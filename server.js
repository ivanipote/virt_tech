require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour lire le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// On sert les fichiers statiques (CSS, JS, Images)
app.use(express.static(path.join(__dirname, 'public')));

// --- ROUTES INTELLIGENTES (URL Propres) ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/accueil', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/virt-dev', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'resultats.html'));
});

app.get('/virt-dev/resultat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'resultats.html'));
});

app.get('/historique', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'historique.html'));
});

// --- LA ROUTE CONTACT QUI MANQUAIT ---
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Rediriger /sitemap.xml/ vers /sitemap.xml pour éviter les erreurs de lecture
app.get('/sitemap.xml/', (req, res) => {
    res.redirect(301, '/sitemap.xml');
});

// --- IMPORTATION DES ROUTES API ---
const contactRoutes = require('./routes/contact');
app.use('/api/contact', contactRoutes);

// --- GESTION DES ERREURS 404 ---
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Le serveur VirtTech tourne sur http://localhost:${PORT}`);
});