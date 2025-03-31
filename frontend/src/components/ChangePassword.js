import React, { useState } from 'react';
import { 
    TextField, 
    Button, 
    Typography, 
    Alert,
    Paper,
    CircularProgress
} from '@mui/material';
import { api } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Le password non coincidono');
            return;
        }
        setLoading(true);
        try {
            console.log('Invio richiesta cambio password');
            await api.post(
                '/api/users/change-password',
                {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                }
            );
            console.log('Password aggiornata con successo');
            setSuccess('Password aggiornata con successo');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Errore nel cambio password:', err);
            if (err.response?.status === 401) {
                console.log('Unauthorized access, logging out');
                logout();
                navigate('/login');
            } else {
                setError(err.response?.data?.message || err.response?.data?.error || 'Errore nel cambio password');
            }
            setTimeout(() => setError(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Cambia Password
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Password Attuale"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Nuova Password"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Conferma Nuova Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Cambia Password'}
                </Button>
            </form>
        </Paper>
    );
};

export default ChangePassword; 