const express = require('express');
const router = express.Router();
const { telechargerVideo } = require('../services/downloadService');

// Route POST pour lancer le téléchargement
router.post('/', async (req, res) => {
    const { url, nom } = req.body;

    // 1. Vérification des champs
    if (!url || !nom) {
        return res.status(400).json({ succes: false, message: "URL et nom du fichier requis." });
    }

    // 2. Sécurité basique : vérifier que c'est bien une URL YouTube
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
        return res.status(400).json({ succes: false, message: "Seuls les liens YouTube sont acceptés pour ce test." });
    }

    try {
        // 3. Appel du service de téléchargement
        const resultat = await telechargerVideo(url, nom + '.mp4');
        
        // 4. Réponse de succès
        res.json({ 
            succes: true, 
            lien: resultat.fichier, 
            message: "Téléchargement réussi !" 
        });
        
    } catch (error) {
        // 5. Gestion de l'erreur
        console.error("Erreur lors du téléchargement :", error.message);
        res.status(500).json({ 
            succes: false, 
            message: "Erreur lors du téléchargement de la vidéo." 
        });
    }
});

module.exports = router;