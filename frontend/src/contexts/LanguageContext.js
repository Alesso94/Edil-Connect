import React, { createContext, useState, useContext, useEffect } from 'react';
import it from '../translations/it';
import en from '../translations/en';

const translations = { it, en };

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'it';
    });

    const [translations, setTranslations] = useState(() => {
        const lang = localStorage.getItem('language') || 'it';
        return lang === 'it' ? it : en;
    });

    useEffect(() => {
        localStorage.setItem('language', language);
        setTranslations(language === 'it' ? it : en);
        // Aggiorna l'attributo lang dell'HTML per l'accessibilità
        document.documentElement.lang = language;
    }, [language]);

    const changeLanguage = (newLanguage) => {
        if (newLanguage in { it, en }) {
            setLanguage(newLanguage);
        }
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t: translations }}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageContext; 