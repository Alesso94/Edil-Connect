const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        console.log('=== INIZIO AUTENTICAZIONE ===');
        console.log('Headers ricevuti:', req.headers);

        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            console.log('Token non trovato negli headers');
            return res.status(401).json({ message: 'Token non fornito' });
        }

        console.log('Token ricevuto:', token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decodificato:', decoded);

        const user = await User.findById(decoded._id);
        console.log('Utente trovato:', user ? {
            id: user._id,
            email: user.email,
            role: user.role,
            isAdmin: user.isAdmin
        } : null);

        if (!user) {
            console.error('Utente non trovato nel database');
            return res.status(401).json({ message: 'Utente non trovato' });
        }

        req.user = user;
        console.log('=== AUTENTICAZIONE COMPLETATA CON SUCCESSO ===');
        next();
    } catch (error) {
        console.error('=== ERRORE DURANTE L\'AUTENTICAZIONE ===');
        console.error('Errore dettagliato:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            name: error.name
        });
        res.status(401).json({ message: 'Autenticazione fallita' });
    }
};

module.exports = auth; 