const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Endpoint per eliminare tutti gli utenti (solo per test)
router.delete('/delete-all-users', async (req, res) => {
    try {
        await User.deleteMany({});
        console.log('Tutti gli utenti sono stati eliminati');
        res.json({ message: 'Tutti gli utenti sono stati eliminati' });
    } catch (error) {
        console.error('Errore nell\'eliminazione degli utenti:', error);
        res.status(500).json({ message: 'Errore nell\'eliminazione degli utenti' });
    }
});

module.exports = router; 