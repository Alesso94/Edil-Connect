import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Box,
    Grid,
    Card,
    CardContent,
    AppBar,
    Toolbar,
} from '@mui/material';
import Logo from '../components/Logo';

const Home = () => {
    return (
        <>
            <AppBar position="static" color="transparent" elevation={0}>
                <Container>
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <RouterLink to="/" style={{ textDecoration: 'none' }}>
                            <Logo width="150" height="40" />
                        </RouterLink>
                        <Box>
                            <Button
                                component={RouterLink}
                                to="/services"
                                color="primary"
                                sx={{ mr: 2 }}
                            >
                                SERVIZI
                            </Button>
                            <Button
                                component="a"
                                href="#funzionalita"
                                color="primary"
                                sx={{ mr: 2 }}
                            >
                                FUNZIONALITÀ
                            </Button>
                            <Button
                                component={RouterLink}
                                to="/about"
                                color="primary"
                                sx={{ mr: 2 }}
                            >
                                CHI SIAMO
                            </Button>
                            <Button
                                component={RouterLink}
                                to="/login"
                                variant="outlined"
                                color="primary"
                                sx={{ mr: 2 }}
                            >
                                ACCEDI
                            </Button>
                            <Button
                                component={RouterLink}
                                to="/register"
                                variant="contained"
                                color="primary"
                            >
                                REGISTRATI
                            </Button>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Box
                sx={{
                    backgroundImage: 'url("/images/background.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: 'calc(100vh - 64px)', // Sottraiamo l'altezza della navbar
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                />
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ pt: 8, mb: 6, textAlign: 'center', color: 'white' }}>
                        <Typography variant="h2" component="h1" gutterBottom>
                            Benvenuto su EdilConnect
                        </Typography>
                        <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.8)' }} paragraph>
                            La piattaforma che connette professionisti e imprese nel settore edile
                        </Typography>
                        <Box sx={{ mt: 4 }}>
                            <Button
                                component={RouterLink}
                                to="/register"
                                variant="contained"
                                size="large"
                                sx={{ mr: 2 }}
                            >
                                Registrati
                            </Button>
                            <Button
                                component={RouterLink}
                                to="/login"
                                variant="outlined"
                                size="large"
                                sx={{ color: 'white', borderColor: 'white' }}
                            >
                                Accedi
                            </Button>
                        </Box>
                    </Box>

                    <Grid container spacing={4} sx={{ mt: 4 }}>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                                <CardContent>
                                    <Typography variant="h5" component="h2" gutterBottom>
                                        Gestione Progetti
                                    </Typography>
                                    <Typography variant="body1">
                                        Organizza e gestisci i tuoi progetti in modo efficiente
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                                <CardContent>
                                    <Typography variant="h5" component="h2" gutterBottom>
                                        Documenti Digitali
                                    </Typography>
                                    <Typography variant="body1">
                                        Gestisci tutti i documenti in formato digitale
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                                <CardContent>
                                    <Typography variant="h5" component="h2" gutterBottom>
                                        Networking
                                    </Typography>
                                    <Typography variant="body1">
                                        Connettiti con altri professionisti del settore
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

export default Home; 