import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            console.log('Tentativo di login...');
            console.log('Email:', email);
            console.log('URL backend:', process.env.REACT_APP_BACKEND_URL);
            
            const response = await login(email, password);
            console.log('Login riuscito:', response);
            
            // Dopo il login, reindirizza alla pagina precedente o alla dashboard
            const from = location.state?.from || '/dashboard';
            console.log('Reindirizzamento a:', from);
            navigate(from, { replace: true });
        } catch (err) {
            console.error('Errore durante il login:', err);
            console.error('Risposta del server:', err.response?.data);
            console.error('Status code:', err.response?.status);
            console.error('Headers:', err.response?.headers);
            
            if (err.response?.status === 401) {
                setError('Credenziali non valide. Controlla email e password.');
            } else if (err.response?.status === 404) {
                setError('Utente non trovato.');
            } else if (err.response?.status === 500) {
                setError('Errore del server. Riprova più tardi.');
            } else if (!err.response) {
                setError('Impossibile connettersi al server. Controlla la connessione.');
            } else {
                setError(err.response?.data?.message || 'Errore durante il login. Controlla le credenziali.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Accedi
                    </Typography>
                    
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                            disabled={isLoading}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3 }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Accesso in corso...' : 'Accedi'}
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login; 