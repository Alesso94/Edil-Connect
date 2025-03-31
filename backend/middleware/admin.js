const User = require('../models/User');

const admin = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        
        if (!user || !user.isAdmin) {
            return res.status(403).json({ error: 'Accesso non autorizzato. Solo gli amministratori possono accedere a questa risorsa.' });
        }
        
        next();
    } catch (error) {
        console.error('Errore nel middleware admin:', error);
        res.status(500).json({ error: 'Errore interno del server' });
    }
};

module.exports = admin; 