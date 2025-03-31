import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Card,
    CardContent,
    CardHeader,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button
} from '@mui/material';
import axios from 'axios';

const AdminPanel = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProfessionals: 0,
        totalProjects: 0,
        pendingVerifications: 0
    });

    const [recentUsers, setRecentUsers] = useState([]);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const response = await axios.get('/api/admin/stats');
            setStats(response.data.stats);
            setRecentUsers(response.data.recentUsers);
        } catch (error) {
            console.error('Errore nel caricamento dei dati admin:', error);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Pannello Amministrativo
            </Typography>

            {/* Statistiche */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Utenti Totali
                            </Typography>
                            <Typography variant="h4">
                                {stats.totalUsers}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Professionisti
                            </Typography>
                            <Typography variant="h4">
                                {stats.totalProfessionals}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Progetti
                            </Typography>
                            <Typography variant="h4">
                                {stats.totalProjects}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Verifiche in Sospeso
                            </Typography>
                            <Typography variant="h4">
                                {stats.pendingVerifications}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Utenti Recenti */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Utenti Recenti
                </Typography>
                <List>
                    {recentUsers.map((user, index) => (
                        <React.Fragment key={user._id}>
                            <ListItem>
                                <ListItemText
                                    primary={user.name}
                                    secondary={`${user.email} - ${user.role}`}
                                />
                            </ListItem>
                            {index < recentUsers.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            </Paper>

            {/* Azioni Amministrative */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Azioni Amministrative
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() => {/* Implementare la gestione utenti */}}
                        >
                            Gestione Utenti
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() => {/* Implementare la verifica professionisti */}}
                        >
                            Verifica Professionisti
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() => {/* Implementare la gestione progetti */}}
                        >
                            Gestione Progetti
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default AdminPanel; 