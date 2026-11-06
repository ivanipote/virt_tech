const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// On dit au serveur de servir les fichiers statiques (le dossier public)
app.use(express.static(path.join(__dirname, 'public')));

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Le serveur VirtTech tourne sur http://localhost:${PORT}`);
});