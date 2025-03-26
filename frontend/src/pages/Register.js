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
    MenuItem,
    Grid
} from '@mui/material';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        phone: '',
        pec: '',
        address: '',
        profession: '',
        licenseNumber: '',
        professionalOrder: '',
        registrationDate: '',
        businessName: '',
        vatNumber: '',
        legalAddress: '',
        businessType: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const userData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                contactInfo: {
                    phone: formData.phone,
                    pec: formData.pec
                }
            };

            if (formData.role === 'professional') {
                userData.professionalInfo = {
                    profession: formData.profession,
                    licenseNumber: formData.licenseNumber,
                    professionalOrder: formData.professionalOrder,
                    registrationDate: formData.registrationDate,
                    address: formData.address
                };
            } else if (formData.role === 'business') {
                userData.businessInfo = {
                    businessName: formData.businessName,
                    vatNumber: formData.vatNumber,
                    legalAddress: formData.legalAddress,
                    businessType: formData.businessType
                };
            }

            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, userData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Errore durante la registrazione');
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

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Nome Completo"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12} sm={6}>
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
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Telefono"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
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

                            {formData.role === 'professional' && (
                                <>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Indirizzo"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Professione"
                                            name="profession"
                                            value={formData.profession}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Numero di Licenza"
                                            name="licenseNumber"
                                            value={formData.licenseNumber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Ordine Professionale"
                                            name="professionalOrder"
                                            value={formData.professionalOrder}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Data di Registrazione"
                                            name="registrationDate"
                                            type="date"
                                            value={formData.registrationDate}
                                            onChange={handleChange}
                                            required
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                </>
                            )}

                            {formData.role === 'business' && (
                                <>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Nome Azienda"
                                            name="businessName"
                                            value={formData.businessName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Partita IVA"
                                            name="vatNumber"
                                            value={formData.vatNumber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Indirizzo Legale"
                                            name="legalAddress"
                                            value={formData.legalAddress}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Tipo di Attività"
                                            name="businessType"
                                            value={formData.businessType}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>

                        <Box sx={{ mt: 3 }}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                sx={{ mb: 2 }}
                            >
                                Registrati
                            </Button>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" color="textSecondary">
                                    Hai già un account?{' '}
                                    <Link component={RouterLink} to="/login" color="primary">
                                        Accedi
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default Register; 