const UserSettings = require('../models/UserSettings');

// Ottieni le impostazioni dell'utente
const getUserSettings = async (req, res) => {
    try {
        let settings = await UserSettings.findOne({ userId: req.user._id });

        // Se non esistono impostazioni, crea quelle di default
        if (!settings) {
            settings = await UserSettings.create({
                userId: req.user._id,
                notificationsEnabled: true,
                emailNotifications: true,
                language: 'it',
                theme: 'light'
            });
        }
        
        res.json(settings);
    } catch (error) {
        console.error('Errore nel recupero delle impostazioni:', error.message);
        res.status(500).json({
            message: 'Errore nel recupero delle impostazioni'
        });
    }
};

// Aggiorna le impostazioni dell'utente
const updateUserSettings = async (req, res) => {
    try {
        // Rimuovi eventuali campi non presenti nel modello
        const allowedFields = [
            'notificationsEnabled', 'emailNotifications', 'smsNotifications',
            'projectUpdatesNotifications', 'deadlineNotifications', 'documentNotifications',
            'language', 'theme', 'dateFormat', 'currencyFormat', 'measurementUnit',
            'profileVisibility', 'showContactInfo', 'showPortfolio', 'twoFactorEnabled',
            'calendarSync', 'googleDriveSync', 'dropboxSync',
            'defaultPdfScale', 'autoSaveInterval', 'fileNamingConvention'
        ];

        const updateData = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });
        
        const settings = await UserSettings.findOneAndUpdate(
            { userId: req.user._id },
            { $set: updateData },
            { new: true, upsert: true }
        );
        
        res.json(settings);
    } catch (error) {
        console.error('Errore nell\'aggiornamento delle impostazioni:', error.message);
        res.status(500).json({
            message: 'Errore nell\'aggiornamento delle impostazioni'
        });
    }
};

module.exports = {
    getUserSettings,
    updateUserSettings
}; 