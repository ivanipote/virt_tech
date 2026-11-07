const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function envoyerAlerteVisites(nombreVisites) {
    const msg = {
        to: process.env.SENDGRID_FROM_EMAIL,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: `🚀 VirtTech : 5 nouvelles visites sur l'accueil !`,
        text: `Ton site vient d'atteindre ${nombreVisites} visites sur la page d'accueil.`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4; border-radius: 10px;">
                <h2 style="color: #323F48;">📊 Alerte VirtTech</h2>
                <p>Ton site <strong>virttech.site</strong> vient d'atteindre <strong>${nombreVisites} visites</strong> sur la page d'accueil.</p>
                <p>Continue comme ça ! 🚀</p>
            </div>
        `,
    };

    try {
        await sgMail.send(msg);
        console.log(`✅ Email d'alerte envoyé (${nombreVisites} visites).`);
    } catch (error) {
        console.error("❌ Erreur d'envoi de l'alerte:", error);
    }
}

module.exports = { envoyerAlerteVisites };