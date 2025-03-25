import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import './Settings.css';

function Settings() {
    const { t, language, changeLanguage } = useLanguage();
    const [settings, setSettings] = useState({
        // Notifiche
        notificationsEnabled: true,
        emailNotifications: true,
        smsNotifications: false,
        projectUpdatesNotifications: true,
        deadlineNotifications: true,
        documentNotifications: true,
        
        // Preferenze di visualizzazione
        language: 'it',
        theme: 'light',
        resolution: '1920x1080',
        dateFormat: 'dd/MM/yyyy',
        currencyFormat: '€',
        measurementUnit: 'metric', // metric/imperial
        
        // Privacy e sicurezza
        profileVisibility: 'public',
        showContactInfo: true,
        showPortfolio: true,
        twoFactorEnabled: false,
        
        // Integrazioni
        calendarSync: false,
        googleDriveSync: false,
        dropboxSync: false,
        
        // Preferenze documenti
        defaultPdfScale: '1:100',
        autoSaveInterval: 5, // minuti
        fileNamingConvention: 'project-date-version'
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token non trovato');
                setMessage('Sessione scaduta. Effettua nuovamente il login.');
                navigate('/login');
                return;
            }

            console.log('Richiesta impostazioni con token:', token);
            const response = await axios.get('http://localhost:3001/api/settings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Risposta dal server:', response.data);
            setSettings(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Errore dettagliato:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            if (error.response?.status === 401 || error.response?.status === 403) {
                setMessage('Sessione scaduta. Effettua nuovamente il login.');
                navigate('/login');
            } else {
                setMessage(`Errore nel caricamento delle impostazioni: ${error.response?.data?.message || error.message}`);
            }
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'language') {
            changeLanguage(value);
        }
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Sessione scaduta. Effettua nuovamente il login.');
                navigate('/login');
                return;
            }

            console.log('Invio aggiornamento impostazioni:', settings);
            const response = await axios.put('http://localhost:3001/api/settings', settings, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Risposta aggiornamento:', response.data);
            setMessage('Impostazioni salvate con successo!');
            
            // Applica il tema
            document.documentElement.setAttribute('data-theme', settings.theme);
            
            // Salva la lingua nelle preferenze locali
            localStorage.setItem('language', settings.language);
            
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Errore dettagliato durante il salvataggio:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            if (error.response?.status === 401 || error.response?.status === 403) {
                setMessage('Sessione scaduta. Effettua nuovamente il login.');
                navigate('/login');
            } else {
                setMessage(`Errore durante il salvataggio: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    // Effetto per applicare la risoluzione
    useEffect(() => {
        if (!settings || !settings.resolution) return;

        const applyResolution = () => {
            try {
                const [width, height] = settings.resolution.split('x').map(Number);
                const baseWidth = 1920; // Risoluzione base di riferimento
                
                // Calcola il fattore di scala basato sulla risoluzione selezionata
                const scale = baseWidth / width;
                
                // Salva la risoluzione nel localStorage
                localStorage.setItem('resolution', settings.resolution);
                localStorage.setItem('scale', scale.toString());
                
                // Applica la scala all'elemento root
                const root = document.documentElement;
                root.style.setProperty('--app-scale', scale);
                root.style.setProperty('--app-width', `${width}px`);
                root.style.setProperty('--app-height', `${height}px`);
                
                console.log(`Applicata risoluzione: ${width}x${height}, scala: ${scale}`);
            } catch (error) {
                console.error('Errore nell\'applicare la risoluzione:', error);
            }
        };

        applyResolution();

        return () => {
            // Non rimuoviamo le proprietà al dismount perché vogliamo che la risoluzione persista
        };
    }, [settings.resolution]);

    // Stili CSS globali per il ridimensionamento
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --app-scale: ${localStorage.getItem('scale') || 1};
                --app-width: ${localStorage.getItem('resolution')?.split('x')[0] || '1920'}px;
                --app-height: ${localStorage.getItem('resolution')?.split('x')[1] || '1080'}px;
            }
            
            /* Applica la scala a tutto il contenuto dell'app */
            #root {
                width: 100%;
                max-width: var(--app-width);
                min-height: 100vh;
                margin: 0 auto;
                transform: scale(var(--app-scale));
                transform-origin: top center;
            }

            /* Compensa lo spazio extra creato dalla trasformazione */
            body {
                min-height: calc(100vh / var(--app-scale));
                overflow-x: hidden;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    if (loading) {
        return <div className="settings-container">{t.settings.messages.loading}</div>;
    }

    return (
        <div>
            <nav className="settings-nav">
                <div className="nav-left">
                    <Link to="/" className="nav-link">
                        <i className="fas fa-home"></i> Home
                    </Link>
                    <Link to="/dashboard" className="nav-link">
                        <i className="fas fa-th-large"></i> Dashboard
                    </Link>
                    <Link to="/dashboard/profilo" className="nav-link">
                        <i className="fas fa-user"></i> {t.navbar.profile}
                    </Link>
                </div>
                <div className="nav-center">
                    <h1>{t.settings.title}</h1>
                </div>
            </nav>
            
            <div className="settings-container">
                {message && <div className={`message ${message.includes('Errore') || message.includes('scaduta') ? 'error' : 'success'}`}>{message}</div>}
                
                <form onSubmit={handleSubmit}>
                    {/* Sezione Notifiche */}
                    <div className="settings-section">
                        <h3>{t.settings.notifications.title}</h3>
                        <div className="setting-item">
                            <label>
                                <input
                                    type="checkbox"
                                    name="notificationsEnabled"
                                    checked={settings.notificationsEnabled}
                                    onChange={handleChange}
                                />
                                {t.settings.notifications.enableAll}
                            </label>
                        </div>
                        <div className="setting-item">
                            <label>
                                <input
                                    type="checkbox"
                                    name="emailNotifications"
                                    checked={settings.emailNotifications}
                                    onChange={handleChange}
                                />
                                {t.settings.notifications.email}
                            </label>
                        </div>
                        <div className="setting-item">
                            <label>
                                <input
                                    type="checkbox"
                                    name="smsNotifications"
                                    checked={settings.smsNotifications}
                                    onChange={handleChange}
                                />
                                {t.settings.notifications.sms}
                            </label>
                        </div>
                        <div className="setting-item">
                            <label>
                                <input
                                    type="checkbox"
                                    name="projectUpdatesNotifications"
                                    checked={settings.projectUpdatesNotifications}
                                    onChange={handleChange}
                                />
                                {t.settings.notifications.projectUpdates}
                            </label>
                        </div>
                        <div className="setting-item">
                            <label>
                                <input
                                    type="checkbox"
                                    name="deadlineNotifications"
                                    checked={settings.deadlineNotifications}
                                    onChange={handleChange}
                                />
                                {t.settings.notifications.deadlines}
                            </label>
                        </div>
                        <div className="setting-item">
                            <label>
                                <input
                                    type="checkbox"
                                    name="documentNotifications"
                                    checked={settings.documentNotifications}
                                    onChange={handleChange}
                                />
                                {t.settings.notifications.documents}
                            </label>
                        </div>
                    </div>

                    {/* Sezione Preferenze di Visualizzazione */}
                    <div className="settings-section">
                        <h3>{t.settings.display.title}</h3>
                        <div className="setting-item">
                            <label>{t.settings.display.language}:</label>
                            <select name="language" value={language} onChange={handleChange}>
                                <option value="it">Italiano</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                        <div className="setting-item">
                            <label>{t.settings.display.theme}:</label>
                            <select name="theme" value={settings.theme} onChange={handleChange}>
                                <option value="light">{t.settings.display.themes.light}</option>
                                <option value="dark">{t.settings.display.themes.dark}</option>
                                <option value="high-contrast">{t.settings.display.themes.highContrast}</option>
                            </select>
                        </div>
                        <div className="setting-item">
                            <label>{t.settings.display.resolution}:</label>
                            <select name="resolution" value={settings.resolution} onChange={handleChange}>
                                <option value="1920x1080">1920x1080 (Full HD)</option>
                                <option value="2560x1440">2560x1440 (2K)</option>
                                <option value="3840x2160">3840x2160 (4K)</option>
                            </select>
                        </div>
                        <div className="setting-item">
                            <label>{t.settings.display.dateFormat}:</label>
                            <select name="dateFormat" value={settings.dateFormat} onChange={handleChange}>
                                <option value="dd/MM/yyyy">DD/MM/YYYY</option>
                                <option value="MM/dd/yyyy">MM/DD/YYYY</option>
                                <option value="yyyy-MM-dd">YYYY-MM-DD</option>
                            </select>
                        </div>
                        <div className="setting-item">
                            <label>{t.settings.display.measurementUnit}:</label>
                            <select name="measurementUnit" value={settings.measurementUnit} onChange={handleChange}>
                                <option value="metric">{t.settings.display.units.metric}</option>
                                <option value="imperial">{t.settings.display.units.imperial}</option>
                            </select>
                        </div>
                    </div>

                    {/* Sezione Privacy e Sicurezza */}
                    <div className="settings-section">
                        <h3>{t.settings.privacy.title}</h3>
                        <div className="setting-item">
                            <label>{t.settings.privacy.visibility}:</label>
                            <select name="profileVisibility" value={settings.profileVisibility} onChange={handleChange}>
                                <option value="public">{t.settings.privacy.visibilityOptions.public}</option>
                                <option value="private">{t.settings.privacy.visibilityOptions.private}</option>
                                <option value="contacts">{t.settings.privacy.visibilityOptions.contacts}</option>
                            </select>
                        </div>
                        <div className="setting-item">
                            <label>
                                <input
                                    type="checkbox"
                                    name="showContactInfo"
                                    checked={settings.showContactInfo}
                                    onChange={handleChange}
                                />
                                {t.settings.privacy.showContactInfo}
                            </label>
                        </div>
                        <div className="setting-item">
                            <label>
                                <input
                                    type="checkbox"
                                    name="twoFactorEnabled"
                                    checked={settings.twoFactorEnabled}
                                    onChange={handleChange}
                                />
                                {t.settings.privacy.twoFactor}
                            </label>
                        </div>
                    </div>

                    {/* Sezione Integrazioni */}
                    <div className="settings-section">
                        <h3>{t.settings.integrations.title}</h3>
                        <div className="setting-item">
                            <label>
                                <input
                                    type="checkbox"
                                    name="calendarSync"
                                    checked={settings.calendarSync}
                                    onChange={handleChange}
                                />
                                {t.settings.integrations.calendar}
                            </label>
                        </div>
                        <div className="setting-item">
                            <label>
                                <input
                                    type="checkbox"
                                    name="googleDriveSync"
                                    checked={settings.googleDriveSync}
                                    onChange={handleChange}
                                />
                                {t.settings.integrations.drive}
                            </label>
                        </div>
                        <div className="setting-item">
                            <label>
                                <input
                                    type="checkbox"
                                    name="dropboxSync"
                                    checked={settings.dropboxSync}
                                    onChange={handleChange}
                                />
                                {t.settings.integrations.dropbox}
                            </label>
                        </div>
                    </div>

                    {/* Sezione Preferenze Documenti */}
                    <div className="settings-section">
                        <h3>{t.settings.documents.title}</h3>
                        <div className="setting-item">
                            <label>{t.settings.documents.scale}:</label>
                            <select name="defaultPdfScale" value={settings.defaultPdfScale} onChange={handleChange}>
                                <option value="1:20">1:20</option>
                                <option value="1:50">1:50</option>
                                <option value="1:100">1:100</option>
                                <option value="1:200">1:200</option>
                            </select>
                        </div>
                        <div className="setting-item">
                            <label>{t.settings.documents.autoSave}:</label>
                            <select name="autoSaveInterval" value={settings.autoSaveInterval} onChange={handleChange}>
                                <option value="1">1</option>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                            </select>
                        </div>
                        <div className="setting-item">
                            <label>{t.settings.documents.naming}:</label>
                            <select name="fileNamingConvention" value={settings.fileNamingConvention} onChange={handleChange}>
                                <option value="project-date-version">{t.settings.documents.namingOptions.projectDateVersion}</option>
                                <option value="date-project-version">{t.settings.documents.namingOptions.dateProjVersion}</option>
                                <option value="custom">{t.settings.documents.namingOptions.custom}</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="save-button">{t.settings.buttons.save}</button>
                </form>
            </div>
        </div>
    );
}

export default Settings; 