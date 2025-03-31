import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Link,
    Paper,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        phone: '',
        pec: '',
        adminCode: '',
        address: '',
        profession: '',
        licenseNumber: '',
        professionalOrder: '',
        registrationDate: '',
        businessName: '',
        vatNumber: '',
        legalAddress: '',
        businessType: '',
        registrationNumber: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validazione base
        if (!formData.name || !formData.email || !formData.password || !formData.role) {
            setError('Compila tutti i campi obbligatori');
            return;
        }

        // Validazione password
        if (formData.password.length < 6) {
            setError('La password deve essere di almeno 6 caratteri');
            return;
        }

        try {
            // Dati base dell'utente
            const userData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                contactInfo: {
                    phone: formData.phone || '',
                    pec: formData.pec || '',
                    alternativeEmail: ''
                }
            };

            // Aggiungi codice admin se il ruolo è admin
            if (formData.role === 'admin') {
                userData.adminCode = formData.adminCode;
            }

            // Aggiungi dati specifici per professionista
            if (formData.role === 'professional') {
                if (!formData.profession || !formData.licenseNumber || !formData.professionalOrder) {
                    setError('Compila tutti i campi obbligatori per il professionista');
                    return;
                }
                userData.professionalInfo = {
                    profession: formData.profession,
                    licenseNumber: formData.licenseNumber,
                    professionalOrder: formData.professionalOrder,
                    orderRegistrationDate: formData.registrationDate || new Date().toISOString()
                };
            }

            // Aggiungi dati specifici per azienda
            if (formData.role === 'business') {
                if (!formData.businessName || !formData.vatNumber || !formData.businessType) {
                    setError('Compila tutti i campi obbligatori per l\'azienda');
                    return;
                }
                userData.businessInfo = {
                    companyName: formData.businessName,
                    vatNumber: formData.vatNumber,
                    businessType: formData.businessType,
                    registrationNumber: formData.registrationNumber || '',
                    legalAddress: {
                        street: formData.legalAddress || '',
                        city: '',
                        postalCode: '',
                        country: 'Italia'
                    }
                };
            }

            console.log('Dati di registrazione:', userData);
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/register`, userData);
            
            if (response.data.message.includes('Controlla la tua email')) {
                navigate('/verify-email', { 
                    state: { 
                        email: formData.email,
                        message: response.data.message 
                    } 
                });
            } else {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Errore di registrazione:', err.response?.data);
            
            // Gestione specifica degli errori
            if (err.response?.data?.error?.includes('E11000 duplicate key error')) {
                setError('Questa email è già registrata. Prova ad accedere o usa un\'altra email.');
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Errore durante la registrazione. Riprova più tardi.');
            }
        }
    };

    const deleteAllUsers = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/test/delete-all-users`);
            console.log('Tutti gli utenti sono stati eliminati');
            setError('');
            setSuccess('Tutti gli utenti sono stati eliminati con successo');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Errore nell\'eliminazione degli utenti:', err);
            setError('Errore nell\'eliminazione degli utenti');
        }
    };

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 64px)',
                backgroundImage: 'url("/images/background.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                py: 4,
                position: 'relative'
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                }}
            />
            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 4, 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: 2
                    }}
                >
                    <Typography variant="h4" component="h1" align="center" gutterBottom>
                        Registrazione
                    </Typography>
                    <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 4 }}>
                        Crea il tuo account su EdilConnect
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            {success}
                        </Alert>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <Button
                            onClick={deleteAllUsers}
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                        >
                            Elimina Tutti gli Utenti (Solo per Test)
                        </Button>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid md={6} lg={6}>
                                <TextField
                                    fullWidth
                                    label="Nome Completo"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid md={6} lg={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid md={6} lg={6}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid md={6} lg={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Ruolo</InputLabel>
                                    <Select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        label="Ruolo"
                                    >
                                        <MenuItem value="professional">Professionista</MenuItem>
                                        <MenuItem value="business">Azienda</MenuItem>
                                        <MenuItem value="admin">Amministratore</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid md={6} lg={6}>
                                <TextField
                                    fullWidth
                                    label="Telefono"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid md={6} lg={6}>
                                <TextField
                                    fullWidth
                                    label="PEC"
                                    name="pec"
                                    type="email"
                                    value={formData.pec}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            {formData.role === 'admin' && (
                                <Grid md={6} lg={6}>
                                    <TextField
                                        fullWidth
                                        label="Codice Admin"
                                        name="adminCode"
                                        type="password"
                                        value={formData.adminCode}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                            )}

                            {formData.role === 'professional' && (
                                <>
                                    <Grid md={12}>
                                        <TextField
                                            fullWidth
                                            label="Indirizzo"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid md={6} lg={6}>
                                        <TextField
                                            fullWidth
                                            label="Professione"
                                            name="profession"
                                            value={formData.profession}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid md={6} lg={6}>
                                        <TextField
                                            fullWidth
                                            label="Numero di Licenza"
                                            name="licenseNumber"
                                            value={formData.licenseNumber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid md={6} lg={6}>
                                        <TextField
                                            fullWidth
                                            label="Ordine Professionale"
                                            name="professionalOrder"
                                            value={formData.professionalOrder}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid md={6} lg={6}>
                                        <TextField
                                            fullWidth
                                            label="Data di Registrazione"
                                            name="registrationDate"
                                            type="date"
                                            value={formData.registrationDate}
                                            onChange={handleChange}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            required
                                        />
                                    </Grid>
                                </>
                            )}

                            {formData.role === 'business' && (
                                <>
                                    <Grid md={12}>
                                        <TextField
                                            fullWidth
                                            label="Nome Azienda"
                                            name="businessName"
                                            value={formData.businessName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid md={6} lg={6}>
                                        <TextField
                                            fullWidth
                                            label="Partita IVA"
                                            name="vatNumber"
                                            value={formData.vatNumber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid md={6} lg={6}>
                                        <TextField
                                            fullWidth
                                            label="Tipo di Attività"
                                            name="businessType"
                                            value={formData.businessType}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid md={12}>
                                        <TextField
                                            fullWidth
                                            label="Indirizzo Legale"
                                            name="legalAddress"
                                            value={formData.legalAddress}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                </>
                            )}

                            <Grid md={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    sx={{ mt: 2 }}
                                >
                                    Registrati
                                </Button>
                            </Grid>
                            <Grid md={12}>
                                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        Hai già un account?{' '}
                                        <Link component={RouterLink} to="/login" color="primary">
                                            Accedi
                                        </Link>
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default Register; 