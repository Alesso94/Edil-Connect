const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Configurazione del trasportatore email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Genera un token di verifica
const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Invia email di verifica
const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verifica il tuo account',
        html: `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                <h2 style="color: #2c3e50; text-align: center;">Benvenuto nella Piattaforma Edilizia</h2>
                <p style="color: #34495e; font-size: 16px; line-height: 1.5;">
                    Grazie per esserti registrato! Per completare la registrazione e accedere a tutti i servizi,
                    clicca sul pulsante qui sotto per verificare il tuo indirizzo email.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" 
                       style="background-color: #3498db; color: white; padding: 12px 24px; 
                              text-decoration: none; border-radius: 4px; display: inline-block;">
                        Verifica Email
                    </a>
                </div>
                <p style="color: #7f8c8d; font-size: 14px; text-align: center;">
                    Se non hai creato tu questo account, puoi ignorare questa email.
                </p>
                <p style="color: #7f8c8d; font-size: 14px; text-align: center;">
                    Il link di verifica scadrà tra 24 ore.
                </p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

module.exports = {
    generateVerificationToken,
    sendVerificationEmail
}; 