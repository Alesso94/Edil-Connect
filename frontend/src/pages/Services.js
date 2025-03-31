import React from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ConstructionIcon from '@mui/icons-material/Construction';
import EngineeringIcon from '@mui/icons-material/Engineering';
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import TimelineIcon from '@mui/icons-material/Timeline';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';

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

    const cardStyle = {
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }
    };

    const mediaStyle = {
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'primary.main',
        color: 'white',
        padding: '0 16px'
    };

    const contentStyle = {
        height: '380px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper'
    };

    const descriptionStyle = {
        height: '80px',
        marginBottom: '16px',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        textOverflow: 'ellipsis'
    };

    const featureListStyle = {
        height: '284px', // 380px - 80px (descrizione) - 16px (margin)
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        overflow: 'hidden'
    };

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
                                sx={cardStyle}
                            >
                                {/* Title Section */}
                                <Box 
                                    sx={mediaStyle}
                                >
                                    <Typography 
                                        variant="h5"
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: '1.4rem',
                                            lineHeight: 1.2,
                                            textAlign: 'center'
                                        }}
                                    >
                                        {service.title}
                                    </Typography>
                                </Box>

                                {/* Content Section */}
                                <Box 
                                    sx={contentStyle}
                                >
                                    {/* Description */}
                                    <Typography 
                                        variant="body1"
                                        sx={descriptionStyle}
                                    >
                                        {service.description}
                                    </Typography>

                                    {/* Features */}
                                    <Box 
                                        sx={featureListStyle}
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