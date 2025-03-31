import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Crea un'istanza di axios per l'applicazione
export const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Funzione per verificare se un token è valido
const isTokenValid = (token) => {
    try {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            console.error('Token non valido: formato errato');
            return false;
        }

        const payload = JSON.parse(atob(tokenParts[1]));
        const expirationTime = payload.exp * 1000; // Converti in millisecondi
        
        if (Date.now() >= expirationTime) {
            console.error('Token scaduto');
            return false;
        }

        return true;
    } catch (e) {
        console.error('Errore nella verifica del token:', e);
        return false;
    }
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        const savedToken = localStorage.getItem('token');
        console.log('Token iniziale dal localStorage:', savedToken);
        if (savedToken && !isTokenValid(savedToken)) {
            console.log('Token non valido, rimozione dal localStorage');
            localStorage.removeItem('token');
            return null;
        }
        return savedToken;
    });

    const [refreshToken, setRefreshToken] = useState(() => {
        return localStorage.getItem('refreshToken');
    });

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        console.log('Utente iniziale dal localStorage:', savedUser ? JSON.parse(savedUser) : null);
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const logout = useCallback(() => {
        console.log('Esecuzione del logout...');
        setToken(null);
        setRefreshToken(null);
        setUser(null);
        console.log('Logout completato');
    }, []);

    // Sincronizza token, refresh token e user con localStorage
    useEffect(() => {
        if (token && isTokenValid(token)) {
            localStorage.setItem('token', token);
            console.log('Token salvato in localStorage:', token);
        } else {
            localStorage.removeItem('token');
            console.log('Token rimosso da localStorage');
            setToken(null);
        }

        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        } else {
            localStorage.removeItem('refreshToken');
        }

        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            console.log('Utente salvato in localStorage:', user);
        } else {
            localStorage.removeItem('user');
            console.log('Utente rimosso da localStorage');
        }
    }, [token, refreshToken, user]);

    // Configura l'interceptor per aggiungere il token alle richieste
    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use(
            (config) => {
                if (token && isTokenValid(token)) {
                    config.headers.Authorization = `Bearer ${token}`;
                    console.log('Token aggiunto alla richiesta:', token);
                } else {
                    console.log('Token non valido o mancante, rimozione header');
                    delete config.headers.Authorization;
                }
                return config;
            }
        );

        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // Se l'errore è 401 e non è già stato fatto un tentativo di refresh
                if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
                    originalRequest._retry = true;

                    try {
                        // Prova a ottenere un nuovo token usando il refresh token
                        const response = await axios.post(`${api.defaults.baseURL}/api/users/refresh-token`, {
                            refreshToken
                        });

                        const { token: newToken, refreshToken: newRefreshToken } = response.data;
                        setToken(newToken);
                        setRefreshToken(newRefreshToken);

                        // Riprova la richiesta originale con il nuovo token
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return api(originalRequest);
                    } catch (refreshError) {
                        // Se il refresh fallisce, effettua il logout
                        console.log('Token non valido o scaduto');
                        logout();
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, [token, refreshToken, logout]);

    const login = async (email, password) => {
        try {
            console.log('Tentativo di login per:', email);
            const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
            console.log('URL backend:', backendUrl);
            
            const response = await axios.post(`${backendUrl}/api/users/login`, {
                email,
                password
            });
            
            console.log('Risposta del server:', response.data);
            
            // Verifica che la risposta contenga i dati necessari
            if (!response.data.token) {
                throw new Error('Token non ricevuto dal server');
            }
            
            // Gestiamo sia il caso in cui token sia una stringa che un oggetto
            const newToken = typeof response.data.token === 'string' 
                ? response.data.token 
                : response.data.token.token;
                
            if (!newToken) {
                throw new Error('Token non valido nella risposta');
            }
            
            // Verifica che il token sia valido
            const tokenParts = newToken.split('.');
            if (tokenParts.length !== 3) {
                throw new Error('Token non valido: formato errato');
            }

            try {
                const payload = JSON.parse(atob(tokenParts[1]));
                console.log('Payload del token:', payload);

                if (Date.now() >= payload.exp * 1000) {
                    throw new Error('Token scaduto');
                }
            } catch (e) {
                console.error('Errore nella decodifica del token:', e);
                throw new Error('Token non valido');
            }

            console.log('Token valido, salvataggio...');
            setToken(newToken);
            setUser(response.data.user);
            
            return response.data;
        } catch (error) {
            console.error('Errore durante il login:', error);
            throw error;
        }
    };

    const isAuthenticated = useCallback(() => {
        const hasToken = !!token;
        console.log('Stato autenticazione:', hasToken);
        return hasToken;
    }, [token]);

    return (
        <AuthContext.Provider value={{ 
            token, 
            user, 
            login, 
            logout, 
            isAuthenticated,
            api 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve essere utilizzato all\'interno di un AuthProvider');
    }
    return context;
};

export default AuthContext; 