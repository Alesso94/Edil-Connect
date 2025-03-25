export default {
    navbar: {
        logo: 'EdilConnect',
        myProjects: 'I Miei Progetti',
        newProject: 'Nuovo Progetto',
        profile: 'Profilo',
        settings: 'Impostazioni',
        logout: 'Esci'
    },
    settings: {
        title: 'Impostazioni',
        notifications: {
            title: 'Notifiche',
            enableAll: 'Abilita tutte le notifiche',
            email: 'Notifiche via email',
            sms: 'Notifiche via SMS',
            projectUpdates: 'Aggiornamenti progetti',
            deadlines: 'Scadenze e deadline',
            documents: 'Modifiche documenti'
        },
        display: {
            title: 'Preferenze di Visualizzazione',
            language: 'Lingua',
            theme: 'Tema',
            themes: {
                light: 'Chiaro',
                dark: 'Scuro',
                highContrast: 'Alto contrasto'
            },
            dateFormat: 'Formato data',
            measurementUnit: 'Unità di misura',
            units: {
                metric: 'Metrico (m, m², m³)',
                imperial: 'Imperiale (ft, ft², ft³)'
            }
        },
        privacy: {
            title: 'Privacy e Sicurezza',
            visibility: 'Visibilità profilo',
            visibilityOptions: {
                public: 'Pubblico',
                private: 'Privato',
                contacts: 'Solo contatti'
            },
            showContactInfo: 'Mostra informazioni di contatto',
            twoFactor: 'Abilita autenticazione a due fattori'
        },
        integrations: {
            title: 'Integrazioni',
            calendar: 'Sincronizza con Google Calendar',
            drive: 'Sincronizza con Google Drive',
            dropbox: 'Sincronizza con Dropbox'
        },
        documents: {
            title: 'Preferenze Documenti',
            scale: 'Scala PDF predefinita',
            autoSave: 'Intervallo auto-salvataggio (minuti)',
            naming: 'Convenzione nomi file',
            namingOptions: {
                projectDateVersion: 'Progetto-Data-Versione',
                dateProjVersion: 'Data-Progetto-Versione',
                custom: 'Personalizzato'
            }
        },
        buttons: {
            save: 'Salva Impostazioni'
        },
        messages: {
            loading: 'Caricamento impostazioni...',
            saveSuccess: 'Impostazioni salvate con successo!',
            saveError: 'Errore durante il salvataggio',
            loadError: 'Errore nel caricamento delle impostazioni',
            sessionExpired: 'Sessione scaduta. Effettua nuovamente il login.'
        }
    }
}; 