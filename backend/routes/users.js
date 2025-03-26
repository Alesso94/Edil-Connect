const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const { generateVerificationToken, sendVerificationEmail } = require('../utils/emailService');

// POST /api/users - Registrazione
router.post('/', async (req, res) => {
    try {
        console.log('Richiesta di registrazione ricevuta:', req.body);
        const userData = { ...req.body };
        
        // Verifica se è richiesta la registrazione come admin
        if (userData.adminCode) {
            console.log('Codice admin fornito:', userData.adminCode);
            if (userData.adminCode === process.env.ADMIN_CODE) {
                console.log('Codice admin valido, registrazione come admin');
                userData.isAdmin = true;
                userData.isVerified = true; // Gli admin sono verificati automaticamente
            } else {
                console.log('Codice admin non valido');
                return res.status(400).json({ message: 'Codice admin non valido' });
            }
            delete userData.adminCode;
        } else {
            // Genera token di verifica per utenti non admin
            const verificationToken = generateVerificationToken();
            const tokenExpires = new Date();
            tokenExpires.setHours(tokenExpires.getHours() + 24); // Token valido per 24 ore

            userData.verificationToken = verificationToken;
            userData.verificationTokenExpires = tokenExpires;
        }

        console.log('Creazione utente con dati:', { ...userData, password: '[HIDDEN]' });
        const user = new User(userData);
        await user.save();
        console.log('Utente salvato con successo');

        // Invia email di verifica per utenti non admin
        if (!userData.isAdmin) {
            try {
                await sendVerificationEmail(user.email, user.verificationToken);
            } catch (emailError) {
                console.error('Errore nell\'invio dell\'email:', emailError);
                return res.status(201).json({ 
                    message: 'Account creato ma si è verificato un errore nell\'invio dell\'email di verifica. Contatta il supporto.',
                    user
                });
            }
        }

        const token = await user.generateAuthToken();
        
        res.status(201).json({ 
            user, 
            token,
            message: userData.isAdmin ? 'Registrazione completata' : 'Registrazione completata. Controlla la tua email per verificare l\'account.'
        });
    } catch (error) {
        console.error('Errore dettagliato durante la registrazione:', error);
        res.status(400).json({ 
            message: 'Errore nella registrazione',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// GET /api/users/verify-email - Verifica email
router.get('/verify-email', async (req, res) => {
    try {
        const { token } = req.query;
        
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() },
            isVerified: false
        });

        if (!user) {
            return res.status(400).json({ 
                message: 'Token di verifica non valido o scaduto' 
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.json({ message: 'Email verificata con successo' });
    } catch (error) {
        res.status(500).json({ message: 'Errore durante la verifica dell\'email' });
    }
});

// POST /api/users/resend-verification - Reinvia email di verifica
router.post('/resend-verification', async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email, isVerified: false });
        
        if (!user) {
            return res.status(400).json({ 
                message: 'Utente non trovato o già verificato' 
            });
        }

        const verificationToken = generateVerificationToken();
        const tokenExpires = new Date();
        tokenExpires.setHours(tokenExpires.getHours() + 24);

        user.verificationToken = verificationToken;
        user.verificationTokenExpires = tokenExpires;
        await user.save();

        await sendVerificationEmail(user.email, verificationToken);

        res.json({ message: 'Email di verifica reinviata con successo' });
    } catch (error) {
        res.status(500).json({ message: 'Errore nell\'invio dell\'email di verifica' });
    }
});

// POST /api/users/login - Login
router.post('/login', async (req, res) => {
    try {
        console.log('Richiesta di login ricevuta per email:', req.body.email);
        
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({
                message: 'Email e password sono obbligatori'
            });
        }

        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        
        console.log('Login completato con successo per:', req.body.email);
        res.json({ 
            user, 
            token,
            message: 'Login effettuato con successo'
        });
    } catch (error) {
        console.error('Errore durante il login:', error.message);
        res.status(401).json({ 
            message: error.message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// POST /api/users/logout - Logout
router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
        await req.user.save();
        res.json({ message: 'Logout effettuato con successo' });
    } catch (error) {
        res.status(500).json({ message: 'Errore durante il logout' });
    }
});

// GET /api/users/me - Ottieni profilo utente
router.get('/me', auth, async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero dei dati utente' });
    }
});

// PATCH /api/users/me - Aggiorna profilo utente
router.patch('/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'profession', 'phone'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Aggiornamenti non validi' });
    }

    try {
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();
        res.json(req.user);
    } catch (error) {
        res.status(400).json({ message: 'Errore nell\'aggiornamento del profilo' });
    }
});

module.exports = router; 