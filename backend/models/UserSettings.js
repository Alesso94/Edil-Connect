const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    // Notifiche
    notificationsEnabled: {
        type: Boolean,
        default: true
    },
    emailNotifications: {
        type: Boolean,
        default: true
    },
    smsNotifications: {
        type: Boolean,
        default: false
    },
    projectUpdatesNotifications: {
        type: Boolean,
        default: true
    },
    deadlineNotifications: {
        type: Boolean,
        default: true
    },
    documentNotifications: {
        type: Boolean,
        default: true
    },

    // Preferenze di visualizzazione
    language: {
        type: String,
        enum: ['it', 'en'],
        default: 'it'
    },
    theme: {
        type: String,
        enum: ['light', 'dark', 'high-contrast'],
        default: 'light'
    },
    dateFormat: {
        type: String,
        enum: ['dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd'],
        default: 'dd/MM/yyyy'
    },
    currencyFormat: {
        type: String,
        default: '€'
    },
    measurementUnit: {
        type: String,
        enum: ['metric', 'imperial'],
        default: 'metric'
    },

    // Privacy e sicurezza
    profileVisibility: {
        type: String,
        enum: ['public', 'private', 'contacts'],
        default: 'public'
    },
    showContactInfo: {
        type: Boolean,
        default: true
    },
    showPortfolio: {
        type: Boolean,
        default: true
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },

    // Integrazioni
    calendarSync: {
        type: Boolean,
        default: false
    },
    googleDriveSync: {
        type: Boolean,
        default: false
    },
    dropboxSync: {
        type: Boolean,
        default: false
    },

    // Preferenze documenti
    defaultPdfScale: {
        type: String,
        enum: ['1:20', '1:50', '1:100', '1:200'],
        default: '1:100'
    },
    autoSaveInterval: {
        type: Number,
        enum: [1, 5, 10, 15],
        default: 5
    },
    fileNamingConvention: {
        type: String,
        enum: ['project-date-version', 'date-project-version', 'custom'],
        default: 'project-date-version'
    }
}, { timestamps: true });

module.exports = mongoose.model('UserSettings', userSettingsSchema); 