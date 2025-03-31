import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 120000, // 2 minuti di timeout
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor per aggiungere il token a tutte le richieste
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor per gestire gli errori
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance; 