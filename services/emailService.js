const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function envoyerEmailContact(nom, email, message) {
    const msg = {
        to: process.env.SENDGRID_FROM_EMAIL,      // Tu reçois sur virtapp@...
        from: process.env.SENDGRID_FROM_EMAIL,    // Envoyé depuis virtapp@...
        replyTo: email,                           // Pour répondre à l'expéditeur
        subject: `Nouveau message de ${nom} via VirtTech`,
        text: `Nom : ${nom}\nEmail : ${email}\n\nMessage :\n${message}`,
        html: `
            <h3>Nouveau message depuis VirtTech</h3>
            <p><strong>Nom :</strong> ${nom}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Message :</strong></p>
            <p>${message}</p>
        `,
    };

    try {
        await sgMail.send(msg);
        return { succes: true, message: "Message envoyé avec succès !" };
    } catch (error) {
        console.error("Erreur SendGrid:", error);
        if (error.response) {
            console.error(error.response.body);
        }
        throw new Error("Erreur lors de l'envoi de l'email.");
    }
}

module.exports = { envoyerEmailContact };