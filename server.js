const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// On sert les fichiers statiques (CSS, JS, Images)
app.use(express.static(path.join(__dirname, 'public')));

// --- ROUTES INTELLIGENTES (URL Propres) ---

// Page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route pour Virt_Dev (Résultats)
app.get('/virt-dev', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'resultats.html'));
});
// On accepte aussi la route demandée avec /resultat à la fin
app.get('/virt-dev/resultat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'resultats.html'));
});

// Route pour l'historique
app.get('/historique', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'historique.html'));
});

// Route pour l'accueil explicite (optionnel)
app.get('/accueil', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- GESTION DES ERREURS 404 (Page personnalisée) ---
// Cette ligne DOIT être à la fin, après toutes les autres routes.
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});


// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Le serveur VirtTech tourne sur http://localhost:${PORT}`);
});