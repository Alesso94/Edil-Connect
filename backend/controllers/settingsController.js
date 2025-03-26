const UserSettings = require('../models/UserSettings');

// Ottieni le impostazioni dell'utente
const getUserSettings = async (req, res) => {
    try {
        console.log('User ID dalla richiesta:', req.user._id);
        
        let settings = await UserSettings.findOne({ userId: req.user._id });
        console.log('Impostazioni trovate:', settings);
        
        // Se non esistono impostazioni, crea quelle di default
        if (!settings) {
            console.log('Creazione impostazioni di default...');
            settings = await UserSettings.create({
                userId: req.user._id,
                notificationsEnabled: true,
                emailNotifications: true,
                language: 'it',
                theme: 'light'
            });
            console.log('Impostazioni di default create:', settings);
        }
        
        res.json(settings);
    } catch (error) {
        console.error('Errore dettagliato nel recupero delle impostazioni:', {
            message: error.message,
            stack: error.stack,
            user: req.user
        });
        res.status(500).json({ 
            message: 'Errore nel recupero delle impostazioni',
            details: error.message 
        });
    }
};

// Aggiorna le impostazioni dell'utente
const updateUserSettings = async (req, res) => {
    try {
        console.log('Dati ricevuti per aggiornamento:', req.body);
        console.log('User ID per aggiornamento:', req.user._id);
        
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
        
        console.log('Impostazioni aggiornate:', settings);
        res.json(settings);
    } catch (error) {
        console.error('Errore dettagliato nell\'aggiornamento delle impostazioni:', {
            message: error.message,
            stack: error.stack,
            user: req.user,
            requestBody: req.body
        });
        res.status(500).json({ 
            message: 'Errore nell\'aggiornamento delle impostazioni',
            details: error.message 
        });
    }
};

module.exports = {
    getUserSettings,
    updateUserSettings
}; 