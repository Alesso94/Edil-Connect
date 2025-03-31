import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Box,
    TextField,
    Button,
    Alert,
    CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { api } from '../context/AuthContext';
import ChangePassword from '../components/ChangePassword';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            fetchUserProfile();
        } else {
            navigate('/login');
        }
    }, [token, navigate]);

    const fetchUserProfile = async () => {
        try {
            console.log('Recupero profilo utente con token:', token);
            const response = await api.get('/api/users/profile');
            console.log('Profilo utente recuperato:', response.data);
            setUser(response.data);
            setError('');
        } catch (error) {
            console.error('Errore nel caricamento del profilo:', error);
            if (error.response?.status === 401) {
                console.log('Unauthorized access, checking token validity');
                const storedToken = localStorage.getItem('token');
                if (!storedToken || storedToken !== token) {
                    console.log('Token mismatch or missing, logging out');
                    logout();
                    navigate('/login');
                } else {
                    setError('Errore di autenticazione. Riprova più tardi.');
                }
            } else {
                setError('Errore nel caricamento del profilo: ' + (error.response?.data?.message || error.message));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedData = {
                name: user.name,
                email: user.email,
                contactInfo: {
                    phone: user.contactInfo?.phone || '',
                    address: user.contactInfo?.address || ''
                }
            };
            
            if (user.role === 'professional' && user.professionalInfo) {
                updatedData.professionalInfo = {
                    profession: user.professionalInfo.profession || '',
                    licenseNumber: user.professionalInfo.licenseNumber || ''
                };
            }
            
            if (user.role === 'business' && user.businessInfo) {
                updatedData.businessInfo = {
                    companyName: user.businessInfo.companyName || '',
                    vatNumber: user.businessInfo.vatNumber || ''
                };
            }
            
            console.log('Aggiornamento profilo con dati:', updatedData);
            const response = await api.put('/api/users/profile', updatedData);
            console.log('Profilo aggiornato con successo:', response.data);
            setSuccess('Profilo aggiornato con successo');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Errore nell\'aggiornamento del profilo:', error);
            if (error.response?.status === 401) {
                logout();
                navigate('/login');
            } else {
                setError('Errore nell\'aggiornamento del profilo: ' + (error.response?.data?.message || error.message));
            }
            setTimeout(() => setError(''), 5000);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (!user && !loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error">
                    Impossibile caricare i dati del profilo. <Button onClick={fetchUserProfile}>Riprova</Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Profilo
            </Typography>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}
            <Card>
                <CardContent>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Informazioni Personali
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Email: {user?.email}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Nome"
                                    name="firstName"
                                    value={user.name || ''}
                                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Cognome"
                                    name="lastName"
                                    value={user.lastName || ''}
                                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Telefono"
                                    name="phone"
                                    value={user.contactInfo?.phone || ''}
                                    onChange={(e) => setUser({
                                        ...user,
                                        contactInfo: { ...user.contactInfo, phone: e.target.value }
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Indirizzo"
                                    name="address"
                                    value={user.contactInfo?.address || ''}
                                    onChange={(e) => setUser({
                                        ...user,
                                        contactInfo: { ...user.contactInfo, address: e.target.value }
                                    })}
                                />
                            </Grid>
                            {user.role === 'professional' && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Professione"
                                            value={user.professionalInfo?.profession || ''}
                                            onChange={(e) => setUser({
                                                ...user,
                                                professionalInfo: { ...user.professionalInfo, profession: e.target.value }
                                            })}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Numero Licenza"
                                            value={user.professionalInfo?.licenseNumber || ''}
                                            onChange={(e) => setUser({
                                                ...user,
                                                professionalInfo: { ...user.professionalInfo, licenseNumber: e.target.value }
                                            })}
                                        />
                                    </Grid>
                                </>
                            )}
                            {user.role === 'business' && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Nome Azienda"
                                            value={user.businessInfo?.companyName || ''}
                                            onChange={(e) => setUser({
                                                ...user,
                                                businessInfo: { ...user.businessInfo, companyName: e.target.value }
                                            })}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Partita IVA"
                                            value={user.businessInfo?.vatNumber || ''}
                                            onChange={(e) => setUser({
                                                ...user,
                                                businessInfo: { ...user.businessInfo, vatNumber: e.target.value }
                                            })}
                                        />
                                    </Grid>
                                </>
                            )}
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    sx={{ mt: 2 }}
                                >
                                    Salva Modifiche
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
            <Box mt={4}>
                <ChangePassword />
            </Box>
        </Container>
    );
};

export default Profile; 