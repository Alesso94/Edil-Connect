const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Professional = require('../models/Professional');

// Middleware per verificare che l'utente sia un professionista registrato
const professionalAuth = async (req, res, next) => {
    try {
        // Verifica il token di autenticazione
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Token di autenticazione mancante' });
        }

        // Decodifica il token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Trova l'utente
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Utente non trovato' });
        }

        // Verifica se l'utente è un professionista
        const professional = await Professional.findOne({ user: user._id });
        if (!professional) {
            return res.status(403).json({ 
                message: 'Accesso negato. Questa funzionalità è riservata ai professionisti registrati.' 
            });
        }

        // Verifica se il professionista è verificato (se necessario)
        if (!professional.isVerified) {
            return res.status(403).json({ 
                message: 'Accesso negato. Il tuo profilo professionale è in attesa di verifica.' 
            });
        }

        // Aggiunge l'utente e il professionista alla richiesta
        req.user = user;
        req.professional = professional;
        next();
    } catch (error) {
        console.error('Errore nell\'autenticazione del professionista:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token non valido' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token scaduto' });
        }
        res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

module.exports = professionalAuth; 