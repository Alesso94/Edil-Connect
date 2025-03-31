const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Ottieni il token dall'header
            token = req.headers.authorization.split(' ')[1];

            // Verifica il token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Ottieni i dati dell'utente dal token
            req.user = await User.findById(decoded._id).select('-password');

            if (!req.user) {
                console.log('Utente non trovato per ID:', decoded._id);
                return res.status(401).json({ message: 'Utente non trovato' });
            }

            console.log('Utente autenticato:', req.user._id);
            next();
        } catch (error) {
            console.error('Errore di autenticazione:', error);
            return res.status(401).json({ message: 'Non autorizzato, token non valido' });
        }
    } else {
        return res.status(401).json({ message: 'Non autorizzato, token mancante' });
    }
};

module.exports = { protect }; 