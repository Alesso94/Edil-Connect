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
    Paper,
} from '@mui/material';
import Logo from '../components/Logo';
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import EngineeringIcon from '@mui/icons-material/Engineering';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const Home = () => {
    return (
        <>
            <AppBar position="static" color="transparent" elevation={0}>
                <Container>
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <RouterLink to="/" style={{ textDecoration: 'none' }}>
                            <Logo />
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
                    backgroundImage: 'url("/images/hero-bg.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: 'calc(100vh - 64px)',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    py: 8
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
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ textAlign: 'center', color: 'white', mb: 8 }}>
                        <Typography 
                            variant="h1" 
                            component="h1" 
                            sx={{ 
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                                fontWeight: 700,
                                mb: 2
                            }}
                        >
                            Benvenuto su EdilConnect
                        </Typography>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                color: 'rgba(255, 255, 255, 0.9)',
                                mb: 4,
                                maxWidth: '800px',
                                mx: 'auto'
                            }}
                        >
                            La piattaforma che connette professionisti e imprese nel settore edile
                        </Typography>
                        <Box>
                            <Button
                                component={RouterLink}
                                to="/register"
                                variant="contained"
                                size="large"
                                sx={{ 
                                    mr: 2,
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1.1rem'
                                }}
                            >
                                Registrati Ora
                            </Button>
                            <Button
                                component={RouterLink}
                                to="/login"
                                variant="outlined"
                                size="large"
                                sx={{ 
                                    color: 'white', 
                                    borderColor: 'white',
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    '&:hover': {
                                        borderColor: 'white',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }}
                            >
                                Accedi
                            </Button>
                        </Box>
                    </Box>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                                        Gestione Progetti
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        Organizza e gestisci i tuoi progetti in modo efficiente con strumenti avanzati di project management.
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        • Dashboard personalizzabile<br />
                                        • Gestione delle scadenze<br />
                                        • Tracciamento attività<br />
                                        • Reportistica avanzata
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                                        Documenti Digitali
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        Gestisci tutti i documenti in formato digitale in un unico spazio sicuro e accessibile.
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        • Archiviazione sicura<br />
                                        • Firma digitale integrata<br />
                                        • Condivisione controllata<br />
                                        • Versionamento documenti
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                                        Collaborazione Team
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        Strumenti avanzati per coordinare il lavoro del team e dei partner in modo efficace.
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        • Chat di progetto<br />
                                        • Calendario condiviso<br />
                                        • Gestione permessi<br />
                                        • Notifiche in tempo reale
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 12, mb: 8, textAlign: 'center' }}>
                        <Typography variant="h3" component="h2" sx={{ color: 'white', mb: 6, fontWeight: 600 }}>
                            Perché Scegliere EdilConnect
                        </Typography>
                        <Grid container spacing={4} justifyContent="center">
                            <Grid item xs={6} md={3}>
                                <Paper sx={{ 
                                    p: 3, 
                                    textAlign: 'center',
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    height: '100%'
                                }}>
                                    <BusinessIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                                    <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 700 }}>
                                        500+
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Aziende Registrate
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Paper sx={{ 
                                    p: 3, 
                                    textAlign: 'center',
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    height: '100%'
                                }}>
                                    <EngineeringIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                                    <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 700 }}>
                                        1000+
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Professionisti
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Paper sx={{ 
                                    p: 3, 
                                    textAlign: 'center',
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    height: '100%'
                                }}>
                                    <TaskAltIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                                    <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 700 }}>
                                        5000+
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Progetti Completati
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Paper sx={{ 
                                    p: 3, 
                                    textAlign: 'center',
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    height: '100%'
                                }}>
                                    <GroupIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                                    <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 700 }}>
                                        98%
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Clienti Soddisfatti
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ 
                        mt: 8, 
                        textAlign: 'center',
                        p: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 2
                    }}>
                        <Typography variant="h4" component="h2" sx={{ color: 'white', mb: 3 }}>
                            Pronto a Iniziare?
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 4 }}>
                            Unisciti a migliaia di professionisti e aziende che stanno già utilizzando EdilConnect
                        </Typography>
                        <Button
                            component={RouterLink}
                            to="/register"
                            variant="contained"
                            size="large"
                            sx={{ 
                                px: 6,
                                py: 2,
                                fontSize: '1.2rem'
                            }}
                        >
                            Inizia Ora Gratuitamente
                        </Button>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default Home; 