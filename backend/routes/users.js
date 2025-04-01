const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const { generateVerificationToken, sendVerificationEmail } = require('../utils/emailService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// POST /api/users/register - Registrazione
router.post('/register', async (req, res) => {
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
        console.log('Richiesta di login ricevuta:', {
            email: req.body.email,
            hasPassword: !!req.body.password
        });
        
        if (!req.body.email || !req.body.password) {
            console.log('Email o password mancanti');
            return res.status(400).json({
                message: 'Email e password sono obbligatori'
            });
        }

        console.log('Cerco utente nel database...');
        const user = await User.findByCredentials(req.body.email, req.body.password);
        console.log('Utente trovato, genero token...');
        const token = await user.generateAuthToken();
        
        console.log('Login completato con successo per:', req.body.email);
        res.json({ 
            user, 
            token,
            message: 'Login effettuato con successo'
        });
    } catch (error) {
        console.error('Errore dettagliato durante il login:', {
            message: error.message,
            stack: error.stack
        });
        res.status(401).json({ 
            message: error.message || 'Credenziali non valide',
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

// GET /api/users/profile - Ottieni il profilo dell'utente autenticato
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password -tokens -verificationToken -verificationTokenExpires');
        
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        res.json(user);
    } catch (error) {
        console.error('Errore nel recupero del profilo:', error);
        res.status(500).json({ error: 'Errore nel recupero del profilo' });
    }
});

// PUT /api/users/profile - Aggiorna il profilo dell'utente
router.put('/profile', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'contactInfo'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: 'Campi non validi per l\'aggiornamento' });
    }

    try {
        updates.forEach(update => {
            if (update === 'contactInfo') {
                Object.keys(req.body.contactInfo).forEach(key => {
                    req.user.contactInfo[key] = req.body.contactInfo[key];
                });
            } else {
                req.user[update] = req.body[update];
            }
        });

        await req.user.save();
        res.json(req.user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint temporaneo per eliminare tutti gli utenti (solo per test)
router.delete('/delete-all', async (req, res) => {
    try {
        await User.deleteMany({});
        res.json({ message: 'Tutti gli utenti sono stati eliminati' });
    } catch (error) {
        console.error('Errore nell\'eliminazione degli utenti:', error);
        res.status(500).json({ message: 'Errore nell\'eliminazione degli utenti' });
    }
});

// POST /api/users/refresh-token - Refresh token
router.post('/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token mancante' });
        }

        // Verifica il refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findOne({ 
            _id: decoded._id,
            'tokens.refreshToken': refreshToken
        });

        if (!user) {
            return res.status(401).json({ message: 'Refresh token non valido' });
        }

        // Genera nuovi token
        const { token: newToken, refreshToken: newRefreshToken } = await user.generateAuthToken();

        // Rimuovi il vecchio refresh token
        user.tokens = user.tokens.filter(t => t.refreshToken !== refreshToken);
        await user.save();

        res.json({ 
            token: newToken,
            refreshToken: newRefreshToken,
            message: 'Token aggiornati con successo'
        });
    } catch (error) {
        console.error('Errore durante il refresh del token:', error);
        res.status(401).json({ message: 'Refresh token non valido o scaduto' });
    }
});
// Endpoint temporaneo di emergenza per debug - RIMUOVERE DOPO L'USO
// Questo endpoint dovrebbe essere accessibile solo in ambiente di sviluppo
router.post('/debug-login', async (req, res) => {
  try {
    console.log('Tentativo di debug-login');
    const { email, password } = req.body;
    
    // Trova l'utente senza validazione completa
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Debug-login: Utente non trovato');
      return res.status(400).json({ message: 'Utente non trovato' });
    }

    // Log dei dettagli dell'utente per debug
    console.log('Utente trovato nel debug-login:', {
      id: user._id,
      email: user.email,
      name: user.name,
      contactInfo: user.contactInfo || 'Nessuna informazione di contatto'
    });

    // Verifica password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Debug-login: Password non corretta');
      return res.status(400).json({ message: 'Password non corretta' });
    }

    // Genera token JWT manualmente (senza salvare nel database)
    const payload = {
      user: {
        id: user._id,
        role: user.role
      }
    };

    jwt.sign(
      payload, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        console.log('Debug-login: Token generato con successo');
        
        // Risposta con token e dati utente
        res.json({
          message: 'Login di debug riuscito',
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );
    
  } catch (err) {
    console.error('Errore in debug-login:', err);
    res.status(500).json({ message: 'Errore del server', error: err.message });
  }
});
// Endpoint temporaneo per creare un utente admin - RIMUOVERE DOPO L'USO
router.get('/create-admin', async (req, res) => {
  try {
    console.log('Tentativo di creazione utente admin');
    
    // Controlla se l'utente esiste già
    const existingUser = await User.findOne({ email: 'admin@edilconnect.it' });
    if (existingUser) {
      console.log('Admin già esistente:', existingUser.email);
      return res.json({ 
        message: 'Admin già esistente', 
        email: existingUser.email,
        // Evita di mostrare dati sensibili
        id: existingUser._id,
        name: existingUser.name,
        role: existingUser.role
      });
    }
    
    // Crea un nuovo utente admin
    const password = 'admin123'; // Cambia con una password sicura
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      name: 'Admin',
      email: 'admin@edilconnect.it',
      password: hashedPassword,
      role: 'admin',
      isAdmin: true,
      isVerified: true,
      contactInfo: {
        phone: '1234567890',
        pec: 'admin@pec.test.it', // PEC di test
        alternativeEmail: 'admin.alt@edilconnect.it'
      }
    });
    
    await newUser.save();
    
    console.log('Utente admin creato con successo');
    res.json({
      message: 'Utente admin creato con successo',
      email: 'admin@edilconnect.it',
      password: password, // Solo per uso interno/test
      role: 'admin'
    });
    
  } catch (err) {
    console.error('Errore creazione admin:', err);
    res.status(500).json({ message: 'Errore server', error: err.message });
  }
});
// Endpoint temporaneo per reset password - RIMUOVERE DOPO L'USO
router.get('/reset-admin-password', async (req, res) => {
  try {
    console.log('Tentativo di reset password admin');
    
    // Trova l'utente admin
    const admin = await User.findOne({ email: 'admin@edilconnect.it' });
    if (!admin) {
      return res.status(404).json({ message: 'Utente admin non trovato' });
    }
    
    // Nuova password semplice e facile da ricordare
    const newPassword = 'Password123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Aggiorna la password
    admin.password = hashedPassword;
    await admin.save();
    
    console.log('Password admin resettata con successo');
    res.json({
      message: 'Password admin resettata con successo',
      email: admin.email,
      newPassword: newPassword // Solo per uso interno/test
    });
    
  } catch (err) {
    console.error('Errore reset password:', err);
    res.status(500).json({ message: 'Errore server', error: err.message });
  }
});
// Endpoint di debug per verificare il processo di autenticazione - RIMUOVERE DOPO L'USO
router.post('/debug-auth', async (req, res) => {
  try {
    console.log('Debug autenticazione - dati ricevuti:', req.body);
    const { email, password } = req.body;
    
    // Cerca l'utente
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ 
        status: 'error',
        message: 'Utente non trovato',
        email: email
      });
    }
    
    console.log('Debug autenticazione - utente trovato:', {
      id: user._id,
      email: user.email,
      passwordHash: user.password.substring(0, 10) + '...' // Mostra solo i primi 10 caratteri per sicurezza
    });
    
    // Verifica la password manualmente
    const isMatch = await bcrypt.compare(password, user.password);
    
    console.log('Debug autenticazione - risultato verifica password:', isMatch);
    
    if (!isMatch) {
      return res.json({ 
        status: 'error',
        message: 'Password non corretta',
        passwordAttempt: password,
        passwordHashStart: user.password.substring(0, 10) + '...'
      });
    }
    
    // Verifica altri vincoli
    if (!user.isVerified && !user.isAdmin) {
      return res.json({ 
        status: 'error',
        message: 'Account non verificato',
        isVerified: user.isVerified,
        isAdmin: user.isAdmin
      });
    }
    
    // Se arriviamo qui, l'autenticazione ha avuto successo
    res.json({
      status: 'success',
      message: 'Autenticazione riuscita',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified
      }
    });
    
  } catch (err) {
    console.error('Errore debug autenticazione:', err);
    res.status(500).json({ 
      status: 'error',
      message: 'Errore server',
      error: err.message
    });
  }
});
module.exports = router; 
