const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminAuth = async (req, res, next) => {
    try {
        // Verifica il token
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Trova l'utente e verifica che sia un admin
        const user = await User.findOne({ _id: decoded._id });
        
        if (!user || !user.isAdmin) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Accesso non autorizzato' });
    }
};

module.exports = adminAuth; 