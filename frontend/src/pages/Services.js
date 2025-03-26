import React from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Services = () => {
    const services = [
        {
            title: 'Gestione Progetti',
            description: 'Gestisci in modo efficiente tutti i tuoi progetti edilizi con strumenti avanzati di project management.',
            features: [
                'Dashboard personalizzabile',
                'Tracciamento delle attività in tempo reale',
                'Gestione delle scadenze e milestone',
                'Reportistica avanzata'
            ]
        },
        {
            title: 'Documenti Digitali',
            description: 'Digitalizza e organizza tutti i documenti del tuo progetto in un unico spazio sicuro e accessibile.',
            features: [
                'Archiviazione sicura dei documenti',
                'Condivisione controllata',
                'Versioning dei documenti',
                'Firma digitale integrata'
            ]
        },
        {
            title: 'Collaborazione Team',
            description: 'Strumenti di collaborazione avanzati per coordinare il lavoro del team e dei partner.',
            features: [
                'Chat di progetto integrate',
                'Condivisione file in tempo reale',
                'Calendario condiviso',
                'Gestione permessi avanzata'
            ]
        },
        {
            title: 'Gestione Clienti',
            description: 'Gestisci le relazioni con i clienti e tieni traccia di tutte le interazioni.',
            features: [
                'Database clienti centralizzato',
                'Storico comunicazioni',
                'Gestione preventivi',
                'Feedback e valutazioni'
            ]
        },
        {
            title: 'Analisi e Reportistica',
            description: 'Strumenti analitici avanzati per monitorare le performance e prendere decisioni informate.',
            features: [
                'Dashboard analytics',
                'Report personalizzabili',
                'Indicatori KPI',
                'Export dati in multipli formati'
            ]
        },
        {
            title: 'Supporto Tecnico',
            description: 'Assistenza tecnica dedicata per garantire la massima efficienza operativa.',
            features: [
                'Supporto multicanale',
                'Knowledge base completa',
                'Video tutorial',
                'Formazione personalizzata'
            ]
        }
    ];

    return (
        <Box sx={{ py: 8, backgroundColor: '#f5f5f5' }}>
            <Container maxWidth="lg">
                {/* Header Section */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h2" component="h1" gutterBottom color="primary">
                        I Nostri Servizi
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 4, color: 'text.secondary' }}>
                        Soluzioni Complete per il Settore Edile
                    </Typography>
                </Box>

                {/* Services Grid */}
                <Grid 
                    container 
                    spacing={3} 
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 3,
                        '& > .MuiGrid-item': {
                            width: '100%',
                            maxWidth: '100%',
                            flexBasis: 'auto',
                            padding: 0
                        }
                    }}
                >
                    {services.map((service, index) => (
                        <Grid item key={index}>
                            <Card 
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                                }}
                            >
                                {/* Title Section */}
                                <Box 
                                    sx={{
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        p: 2,
                                        textAlign: 'center'
                                    }}
                                >
                                    <Typography 
                                        variant="h5"
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: '1.4rem',
                                            lineHeight: 1.2
                                        }}
                                    >
                                        {service.title}
                                    </Typography>
                                </Box>

                                {/* Content Section */}
                                <Box 
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        p: 3,
                                        flexGrow: 1,
                                        bgcolor: 'background.paper'
                                    }}
                                >
                                    {/* Description */}
                                    <Typography 
                                        variant="body1"
                                        sx={{
                                            mb: 3,
                                            color: 'text.primary',
                                            lineHeight: 1.4
                                        }}
                                    >
                                        {service.description}
                                    </Typography>

                                    {/* Features */}
                                    <Box 
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(2, 1fr)',
                                            gap: 2
                                        }}
                                    >
                                        {service.features.map((feature, idx) => (
                                            <Box 
                                                key={idx}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    '&:before': {
                                                        content: '"•"',
                                                        color: 'primary.main',
                                                        mr: 1,
                                                        fontSize: '1rem',
                                                        lineHeight: 1.5
                                                    }
                                                }}
                                            >
                                                <Typography 
                                                    variant="body2"
                                                    sx={{
                                                        color: 'text.secondary',
                                                        fontSize: '0.9rem',
                                                        lineHeight: 1.5
                                                    }}
                                                >
                                                    {feature}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* CTA Section */}
                <Box sx={{ mt: 8, textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom color="primary">
                        Pronto a Iniziare?
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4 }}>
                        Registrati ora e scopri tutti i vantaggi di EdilConnect
                    </Typography>
                    <Button
                        component={RouterLink}
                        to="/register"
                        variant="contained"
                        color="primary"
                        size="large"
                    >
                        Inizia Ora
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default Services; 