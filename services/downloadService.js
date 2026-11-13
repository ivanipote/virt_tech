const youtubedl = require('yt-dlp-exec');
const path = require('path');
const fs = require('fs');

const DOWNLOAD_DIR = path.join(__dirname, '..', 'public', 'downloads');

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

async function telechargerVideo(url, nomFichier) {
    const outputPath = path.join(DOWNLOAD_DIR, nomFichier);
    
    try {
        await youtubedl(url, {
            output: outputPath,
            // On demande la meilleure vidéo + le meilleur audio
            format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
            // On demande à FFmpeg de fusionner le tout en mp4
            mergeOutputFormat: 'mp4',
            // Options de sécurité et de silence
            noCheckCertificates: true,
            noWarnings: true
        });
        return { succes: true, fichier: `/downloads/${nomFichier}` };
    } catch (error) {
        console.error("Erreur yt-dlp:", error);
        throw new Error("Impossible de télécharger la vidéo.");
    }
}

module.exports = { telechargerVideo };