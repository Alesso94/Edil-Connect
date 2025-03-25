const express = require('express');
const router = express.Router();
const { getUserSettings, updateUserSettings } = require('../controllers/settingsController');
const auth = require('../middleware/auth');

// Tutte le rotte delle impostazioni richiedono autenticazione
router.use(auth);

// Ottieni le impostazioni dell'utente
router.get('/', getUserSettings);

// Aggiorna le impostazioni dell'utente
router.put('/', updateUserSettings);

module.exports = router; 