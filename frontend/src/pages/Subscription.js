import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Box,
    Alert,
    CircularProgress,
    AppBar,
    Toolbar,
    IconButton,
    Chip
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { blue, green, grey } from '@mui/material/colors';

const Subscription = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const isAuthenticated = !!token;

    // Piani di abbonamento
    const plans = [
        {
            id: 'price_basic',
            name: 'Piano Base',
            amount: 0,
            interval: 'unlimited',
            description: 'Perfetto per esplorare la piattaforma',
            popular: false,
            color: grey[500],
            features: [
                'Consultazione profili professionisti',
                'Ricerca progetti',
                'Contatto base con professionisti',
                'Visualizzazione documenti pubblici'
            ]
        },
        {
            id: 'price_professional',
            name: 'Piano Professionista',
            amount: 29900,
            interval: 'year',
            description: 'Per professionisti e studi professionali',
            popular: true,
            color: blue[500],
            features: [
                'Tutte le funzionalità del piano base',
                'Gestione progetti illimitata',
                'Documenti digitali avanzati',
                'Firma digitale integrata',
                'Chat di progetto',
                'Calendario condiviso',
                'Gestione permessi avanzata',
                'Reportistica avanzata'
            ]
        },
        {
            id: 'price_business',
            name: 'Piano Azienda',
            amount: 59900,
            interval: 'year',
            description: 'Per imprese e aziende',
            popular: false,
            color: green[500],
            features: [
                'Tutte le funzionalità del piano professionista',
                'Multi-utente (fino a 10 utenti)',
                'Gestione team avanzata',
                'API access',
                'Supporto prioritario telefonico',
                'Personalizzazione avanzata',
                'Analytics avanzate'
            ]
        }
    ];

    // Funzione per gestire l'abbonamento
    const handleSubscribe = (plan) => {
        // Piano base gratuito
        if (plan.id === 'price_basic') {
            if (!isAuthenticated) {
                navigate('/register');
                return;
            }
            
            setSelectedPlan(plan.id);
            setSuccessMessage('Hai attivato con successo il piano base gratuito!');
            return;
        }

        // Piani a pagamento
        if (!isAuthenticated) {
            // Memorizza il piano selezionato e reindirizza alla registrazione
            localStorage.setItem('selectedPlan', plan.id);
            navigate('/register');
            return;
        }

        setLoading(true);
        setError(null);

        // Simula una richiesta API
        setTimeout(() => {
            setLoading(false);
            setSelectedPlan(plan.id);
            setSuccessMessage(`Abbonamento al piano ${plan.name} completato con successo! Ora puoi accedere a tutte le funzionalità premium.`);
            
            // Alert di conferma
            alert(`Grazie per l'abbonamento a ${plan.name}!`);
        }, 1500);
    };

    // Naviga alla dashboard
    const goToDashboard = () => {
        navigate('/dashboard');
    };

    // Naviga alla home
    const goToHome = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ pt: 2 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" flexDirection="column">
                    <CircularProgress sx={{ mb: 3 }} />
                    <Typography>Elaborazione dell'abbonamento...</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Button 
                    startIcon={<ArrowBackIcon />}
                    onClick={goToHome}
                    variant="outlined"
                >
                    Torna alla Home
                </Button>
                
                {isAuthenticated && (
                    <Button
                        variant="contained"
                        onClick={goToDashboard}
                    >
                        Dashboard
                    </Button>
                )}
            </Box>

            <Typography variant="h4" component="h1" gutterBottom align="center">
                Scegli il Tuo Piano
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {successMessage && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    {successMessage}
                    <Box sx={{ mt: 2 }}>
                        {isAuthenticated && (
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={goToDashboard}
                                sx={{ mr: 2 }}
                            >
                                Vai alla Dashboard
                            </Button>
                        )}
                        <Button 
                            variant="outlined" 
                            onClick={goToHome}
                        >
                            Torna alla Home
                        </Button>
                    </Box>
                </Alert>
            )}

            {!successMessage && (
                <>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                            Scegli il piano più adatto alle tue esigenze
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Tutti i piani includono supporto tecnico e aggiornamenti regolari
                        </Typography>
                    </Box>

                    <Grid container spacing={4} justifyContent="center">
                        {plans.map((plan) => (
                            <Grid item xs={12} md={4} key={plan.id}>
                                <Card 
                                    sx={{ 
                                        height: '100%', 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        boxShadow: selectedPlan === plan.id ? 8 : 2,
                                        ...(selectedPlan === plan.id && {
                                            transform: 'scale(1.02)',
                                            border: '2px solid',
                                            borderColor: plan.color
                                        }),
                                        '&:hover': {
                                            boxShadow: 5,
                                            transform: 'translateY(-8px)'
                                        }
                                    }}
                                    onClick={() => setSelectedPlan(plan.id)}
                                >
                                    <Box sx={{ 
                                        bgcolor: plan.color, 
                                        color: 'white', 
                                        py: 1,
                                        px: 2,
                                        position: 'relative'
                                    }}>
                                        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                                            {plan.name}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                {plan.description}
                                            </Typography>
                                            {plan.popular && (
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                        ml: 1, 
                                                        bgcolor: 'rgba(255,255,255,0.2)', 
                                                        px: 1, 
                                                        py: 0.5, 
                                                        borderRadius: 1,
                                                        fontWeight: 'bold',
                                                        border: '1px solid rgba(255,255,255,0.5)'
                                                    }}
                                                >
                                                    Più Popolare
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                    
                                    <CardContent sx={{ flexGrow: 1, px: 3, pt: 3 }}>
                                        <Typography variant="h4" sx={{ color: plan.color, fontWeight: 'bold', mb: 2 }}>
                                            {plan.amount === 0 ? 'Gratuito' : `€${(plan.amount / 100).toFixed(2)}`}
                                            {plan.amount > 0 && (
                                                <Typography component="span" variant="subtitle1" color="text.secondary">
                                                    /{plan.interval === 'month' ? 'mese' : 'anno'}
                                                </Typography>
                                            )}
                                        </Typography>
                                        
                                        <Box sx={{ mt: 2 }}>
                                            {plan.features.map((feature, index) => (
                                                <Box key={index} sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center',
                                                    mb: 1,
                                                    py: 0.5
                                                }}>
                                                    <Box 
                                                        sx={{ 
                                                            width: 6, 
                                                            height: 6, 
                                                            bgcolor: plan.color,
                                                            borderRadius: '50%',
                                                            mr: 1.5
                                                        }} 
                                                    />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {feature}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    </CardContent>
                                    
                                    <CardActions sx={{ p: 3, pt: 0 }}>
                                        <Button
                                            fullWidth
                                            variant={selectedPlan === plan.id ? "contained" : "outlined"}
                                            sx={{
                                                borderRadius: 2,
                                                py: 1,
                                                ...(selectedPlan === plan.id ? {
                                                    bgcolor: plan.color,
                                                    '&:hover': {
                                                        bgcolor: plan.color
                                                    }
                                                } : {
                                                    color: plan.color,
                                                    borderColor: plan.color,
                                                    '&:hover': {
                                                        borderColor: plan.color
                                                    }
                                                })
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSubscribe(plan);
                                            }}
                                            disabled={loading}
                                        >
                                            {plan.amount === 0 
                                                ? (selectedPlan === plan.id ? "Piano Selezionato" : "Inizia Gratuitamente") 
                                                : (selectedPlan === plan.id ? "Piano Selezionato" : "Seleziona Piano")}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </Container>
    );
};

export default Subscription; 