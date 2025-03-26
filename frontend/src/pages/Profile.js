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
} from '@mui/material';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/users/profile`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(response.data);
        } catch (err) {
            setError('Errore nel caricamento del profilo');
            console.error('Errore:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/api/users/profile`,
                user,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess('Profilo aggiornato con successo');
        } catch (err) {
            setError('Errore nell\'aggiornamento del profilo');
            console.error('Errore:', err);
        }
    };

    if (!user) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography>Caricamento...</Typography>
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
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Nome"
                                    value={user.name}
                                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    value={user.email}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Telefono"
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
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    Salva Modifiche
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Profile; 