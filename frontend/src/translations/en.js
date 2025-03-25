export default {
    navbar: {
        logo: 'EdilConnect',
        myProjects: 'My Projects',
        newProject: 'New Project',
        profile: 'Profile',
        settings: 'Settings',
        logout: 'Logout'
    },
    settings: {
        title: 'Settings',
        notifications: {
            title: 'Notifications',
            enableAll: 'Enable all notifications',
            email: 'Email notifications',
            sms: 'SMS notifications',
            projectUpdates: 'Project updates',
            deadlines: 'Deadlines',
            documents: 'Document changes'
        },
        display: {
            title: 'Display Preferences',
            language: 'Language',
            theme: 'Theme',
            themes: {
                light: 'Light',
                dark: 'Dark',
                highContrast: 'High Contrast'
            },
            dateFormat: 'Date format',
            measurementUnit: 'Measurement unit',
            units: {
                metric: 'Metric (m, m², m³)',
                imperial: 'Imperial (ft, ft², ft³)'
            }
        },
        privacy: {
            title: 'Privacy & Security',
            visibility: 'Profile visibility',
            visibilityOptions: {
                public: 'Public',
                private: 'Private',
                contacts: 'Contacts only'
            },
            showContactInfo: 'Show contact information',
            twoFactor: 'Enable two-factor authentication'
        },
        integrations: {
            title: 'Integrations',
            calendar: 'Sync with Google Calendar',
            drive: 'Sync with Google Drive',
            dropbox: 'Sync with Dropbox'
        },
        documents: {
            title: 'Document Preferences',
            scale: 'Default PDF scale',
            autoSave: 'Auto-save interval (minutes)',
            naming: 'File naming convention',
            namingOptions: {
                projectDateVersion: 'Project-Date-Version',
                dateProjVersion: 'Date-Project-Version',
                custom: 'Custom'
            }
        },
        buttons: {
            save: 'Save Settings'
        },
        messages: {
            loading: 'Loading settings...',
            saveSuccess: 'Settings saved successfully!',
            saveError: 'Error saving settings',
            loadError: 'Error loading settings',
            sessionExpired: 'Session expired. Please login again.'
        }
    }
}; 