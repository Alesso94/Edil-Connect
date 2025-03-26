import React from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Avatar,
} from '@mui/material';
import {
    Engineering,
    Business,
    Construction,
    Security,
    Speed,
    Group
} from '@mui/icons-material';

const About = () => {
    const features = [
        {
            icon: <Engineering sx={{ fontSize: 40 }} />,
            title: 'Esperienza nel Settore',
            description: 'Team di professionisti con anni di esperienza nel settore edile'
        },
        {
            icon: <Business sx={{ fontSize: 40 }} />,
            title: 'Soluzioni Innovative',
            description: 'Piattaforma all\'avanguardia per la gestione digitale dei progetti'
        },
        {
            icon: <Construction sx={{ fontSize: 40 }} />,
            title: 'Supporto Tecnico',
            description: 'Assistenza tecnica specializzata per ogni esigenza'
        },
        {
            icon: <Security sx={{ fontSize: 40 }} />,
            title: 'Sicurezza Garantita',
            description: 'Massima protezione dei dati e delle informazioni sensibili'
        },
        {
            icon: <Speed sx={{ fontSize: 40 }} />,
            title: 'Efficienza',
            description: 'Ottimizzazione dei processi e riduzione dei tempi di gestione'
        },
        {
            icon: <Group sx={{ fontSize: 40 }} />,
            title: 'Community',
            description: 'Network di professionisti e imprese del settore'
        }
    ];

    return (
        <Box sx={{ py: 8, backgroundColor: '#f5f5f5' }}>
            <Container>
                {/* Header Section */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h2" component="h1" gutterBottom color="primary">
                        Chi Siamo
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 4, color: 'text.secondary' }}>
                        EdilConnect: La Piattaforma che Rivoluziona il Settore Edile
                    </Typography>
                </Box>

                {/* Mission Section */}
                <Box sx={{ mb: 8 }}>
                    <Card elevation={0} sx={{ backgroundColor: 'transparent' }}>
                        <CardContent>
                            <Typography variant="h4" gutterBottom color="primary">
                                La Nostra Missione
                            </Typography>
                            <Typography variant="body1" paragraph>
                                EdilConnect nasce dalla visione di semplificare e digitalizzare il settore edile, 
                                offrendo una piattaforma innovativa che connette professionisti, imprese e clienti.
                                Il nostro obiettivo è fornire strumenti all'avanguardia per la gestione dei progetti,
                                la collaborazione tra team e la digitalizzazione dei processi.
                            </Typography>
                            <Typography variant="body1">
                                Crediamo che la tecnologia possa trasformare il modo in cui il settore edile opera,
                                rendendo più efficienti i processi e migliorando la comunicazione tra tutti gli attori coinvolti.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Features Grid */}
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                        <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}>
                                            {feature.icon}
                                        </Avatar>
                                    </Box>
                                    <Typography variant="h5" component="h3" gutterBottom align="center">
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" align="center">
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Stats Section */}
                <Box sx={{ mt: 8, textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom color="primary">
                        I Nostri Numeri
                    </Typography>
                    <Grid container spacing={4} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h2" color="primary">500+</Typography>
                            <Typography variant="h6">Progetti Gestiti</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h2" color="primary">1000+</Typography>
                            <Typography variant="h6">Utenti Attivi</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h2" color="primary">98%</Typography>
                            <Typography variant="h6">Clienti Soddisfatti</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default About; 