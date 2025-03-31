import React from 'react';
import {
    Container,
    Typography,
    Button,
    Box,
    Grid,
    Paper,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import EngineeringIcon from '@mui/icons-material/Engineering';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Box sx={{
            minHeight: 'calc(100vh - 64px)',
            backgroundImage: 'url("/images/hero-bg.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            pt: 10,
            pb: 8
        }}>
            {/* Overlay scuro */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
            }} />

            {/* Contenuto principale */}
            <Container sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ textAlign: 'center', color: 'white', mb: 8 }}>
                    <Typography
                        component="h1"
                        variant="h2"
                        sx={{
                            mb: 2,
                            fontWeight: 'bold',
                            fontSize: { xs: '2.5rem', md: '3.5rem' }
                        }}
                    >
                        Benvenuto su EdilConnect
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            mb: 4,
                            maxWidth: '800px',
                            mx: 'auto'
                        }}
                    >
                        La piattaforma che connette professionisti e imprese nel settore edile
                    </Typography>
                    {!isAuthenticated() && (
                        <Box sx={{ mt: 4 }}>
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
                    )}
                </Box>

                {/* Sezione caratteristiche */}
                <Box sx={{ mt: 8 }}>
                    <Grid container spacing={4} justifyContent="center" alignItems="stretch">
                        {[
                            {
                                title: 'Gestione Progetti',
                                description: 'Organizza e gestisci i tuoi progetti in modo efficiente con strumenti avanzati di project management.',
                                features: [
                                    'Dashboard personalizzabile',
                                    'Gestione delle scadenze',
                                    'Tracciamento attività',
                                    'Reportistica avanzata'
                                ]
                            },
                            {
                                title: 'Documenti Digitali',
                                description: 'Gestisci tutti i documenti in formato digitale in un unico spazio sicuro e accessibile.',
                                features: [
                                    'Archiviazione sicura',
                                    'Firma digitale integrata',
                                    'Condivisione controllata',
                                    'Versionamento documenti'
                                ]
                            },
                            {
                                title: 'Collaborazione Team',
                                description: 'Strumenti avanzati per coordinare il lavoro del team e dei partner in modo efficace.',
                                features: [
                                    'Chat di progetto',
                                    'Calendario condiviso',
                                    'Gestione permessi',
                                    'Notifiche in tempo reale'
                                ]
                            }
                        ].map((card, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Box
                                    sx={{
                                        maxWidth: '300px',
                                        mx: 'auto',
                                        width: '100%',
                                        height: '100%'
                                    }}
                                >
                                    <Paper 
                                        elevation={0}
                                        sx={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(8px)',
                                            WebkitBackdropFilter: 'blur(8px)',
                                            border: '1px solid rgba(255, 255, 255, 0.18)',
                                            borderRadius: 2,
                                            p: 2.5,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <Typography 
                                            variant="h6" 
                                            component="h3"
                                            sx={{ 
                                                fontWeight: 600,
                                                textAlign: 'center',
                                                mb: 1.5,
                                                color: 'white'
                                            }}
                                        >
                                            {card.title}
                                        </Typography>
                                        <Typography 
                                            variant="body2"
                                            sx={{ 
                                                textAlign: 'center',
                                                mb: 2,
                                                color: 'rgba(255, 255, 255, 0.9)'
                                            }}
                                        >
                                            {card.description}
                                        </Typography>
                                        <Box 
                                            component="ul" 
                                            sx={{ 
                                                p: 0,
                                                m: 0,
                                                mt: 'auto',
                                                listStyle: 'none'
                                            }}
                                        >
                                            {card.features.map((feature, idx) => (
                                                <Typography 
                                                    component="li" 
                                                    variant="body2"
                                                    key={idx} 
                                                    sx={{ 
                                                        py: 0.75,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        color: 'white',
                                                        '&:before': {
                                                            content: '"•"',
                                                            marginRight: 1.5,
                                                            color: 'primary.main'
                                                        }
                                                    }}
                                                >
                                                    {feature}
                                                </Typography>
                                            ))}
                                        </Box>
                                    </Paper>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Sezione statistiche */}
                <Box sx={{ mt: 12, mb: 8 }}>
                    <Typography variant="h3" component="h2" sx={{ color: 'white', mb: 6, textAlign: 'center', fontWeight: 600 }}>
                        Perché Scegliere EdilConnect
                    </Typography>
                    <Grid container spacing={4} justifyContent="center" alignItems="stretch">
                        {[
                            { icon: BusinessIcon, number: '500+', text: 'Aziende Registrate' },
                            { icon: EngineeringIcon, number: '1000+', text: 'Professionisti' },
                            { icon: TaskAltIcon, number: '5000+', text: 'Progetti Completati' },
                            { icon: GroupIcon, number: '98%', text: 'Clienti Soddisfatti' }
                        ].map((stat, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Box
                                    sx={{
                                        maxWidth: '250px',
                                        mx: 'auto',
                                        width: '100%',
                                        height: '100%'
                                    }}
                                >
                                    <Paper sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        height: '100%'
                                    }}>
                                        <stat.icon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                                        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: 'white' }}>
                                            {stat.number}
                                        </Typography>
                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                            {stat.text}
                                        </Typography>
                                    </Paper>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Call to action finale */}
                <Box sx={{ 
                    mt: 8, 
                    mb: 8, 
                    textAlign: 'center',
                    p: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                    <Typography variant="h4" component="h2" sx={{ color: 'white', mb: 3 }}>
                        Pronto a far Crescere il Tuo Business?
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2 }}>
                        Accedi a tutti i servizi premium di EdilConnect con un abbonamento annuale
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 4 }}>
                        Gestione progetti avanzata, documenti digitali, collaborazione team e molto altro
                    </Typography>
                    <Button
                        component={RouterLink}
                        to="/subscription"
                        variant="contained"
                        size="large"
                        sx={{ 
                            px: 6,
                            py: 2,
                            fontSize: '1.2rem'
                        }}
                    >
                        Scopri i Piani e le Tariffe
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default Home; 