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
    Chip,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
    useMediaQuery,
    Skeleton
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { blue, green, grey } from '@mui/material/colors';
import CheckIcon from '@mui/icons-material/Check';
import axios from 'axios';
import StripeCheckoutButton from '../components/StripeCheckoutButton';

const Subscription = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const isAuthenticated = !!token;
    const [plans, setPlans] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Piani di abbonamento
    const plansData = [
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

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await axios.get('/api/subscriptions/plans');
                setPlans(response.data);
            } catch (error) {
                console.error('Errore nel recupero dei piani:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

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

    // Funzioni di utilità per formattare i prezzi
    const formatPrice = (amount) => {
        return (amount / 100).toFixed(2).replace('.', ',') + ' €';
    };

    // Caratteristiche incluse nei piani
    const features = [
        'Accesso a tutti i progetti',
        'Gestione documenti digitali',
        'Archiviazione sicura',
        'Dashboard personalizzata',
        'Assistenza prioritaria',
        'Collaborazione team'
    ];

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
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Box textAlign="center" mb={6}>
                <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                    Piani di Abbonamento
                </Typography>
                <Typography variant="h6" color="text.secondary" maxWidth="800px" mx="auto">
                    Scegli il piano più adatto alle tue esigenze e accedi a tutti i servizi premium di EdilConnect
                </Typography>
            </Box>

            {loading ? (
                <Grid container spacing={4} justifyContent="center">
                    {[1, 2].map((item) => (
                        <Grid item xs={12} md={6} key={item}>
                            <Skeleton variant="rectangular" height={400} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Grid container spacing={4} justifyContent="center">
                    {/* Piano Mensile */}
                    <Grid item xs={12} md={6} lg={5}>
                        <Card 
                            elevation={3}
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                overflow: 'visible'
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1, p: 4 }}>
                                <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                                    Piano Mensile
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                                    <Typography variant="h3" component="span" fontWeight="bold">
                                        {formatPrice(plans?.monthly?.amount || 2999)}
                                    </Typography>
                                    <Typography variant="subtitle1" component="span" ml={1}>
                                        /mese
                                    </Typography>
                                </Box>
                                
                                <Divider sx={{ my: 2 }} />
                                
                                <List>
                                    {features.map((feature, index) => (
                                        <ListItem key={index} disableGutters sx={{ py: 1 }}>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <CheckIcon color="primary" />
                                            </ListItemIcon>
                                            <ListItemText primary={feature} />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                            
                            <CardActions sx={{ p: 4, pt: 0 }}>
                                <StripeCheckoutButton
                                    planId="monthly"
                                    buttonText="Abbonati Mensilmente"
                                    fullWidth
                                    size="large"
                                />
                            </CardActions>
                        </Card>
                    </Grid>
                    
                    {/* Piano Annuale */}
                    <Grid item xs={12} md={6} lg={5}>
                        <Card 
                            elevation={4}
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                overflow: 'visible',
                                border: '2px solid',
                                borderColor: 'primary.main',
                            }}
                        >
                            <Box 
                                sx={{
                                    position: 'absolute',
                                    top: -12,
                                    right: 24,
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: 1,
                                    fontSize: '0.875rem',
                                    fontWeight: 'bold',
                                    zIndex: 1,
                                }}
                            >
                                CONSIGLIATO
                            </Box>
                            
                            <CardContent sx={{ flexGrow: 1, p: 4 }}>
                                <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                                    Piano Annuale
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                                    <Typography variant="h3" component="span" fontWeight="bold">
                                        {formatPrice(plans?.annual?.amount || 29900)}
                                    </Typography>
                                    <Typography variant="subtitle1" component="span" ml={1}>
                                        /anno
                                    </Typography>
                                </Box>
                                <Typography variant="subtitle2" color="primary.main" sx={{ mb: 3 }}>
                                    Risparmia il 20% rispetto al piano mensile!
                                </Typography>
                                
                                <Divider sx={{ my: 2 }} />
                                
                                <List>
                                    {features.map((feature, index) => (
                                        <ListItem key={index} disableGutters sx={{ py: 1 }}>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <CheckIcon color="primary" />
                                            </ListItemIcon>
                                            <ListItemText primary={feature} />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                            
                            <CardActions sx={{ p: 4, pt: 0 }}>
                                <StripeCheckoutButton
                                    planId="annual"
                                    buttonText="Abbonati Annualmente"
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                />
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            )}
            
            <Box sx={{ mt: 8, p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Typography variant="h5" component="h3" gutterBottom>
                    Domande Frequenti
                </Typography>
                <Grid container spacing={3} mt={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            Come funziona il pagamento?
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            I pagamenti vengono elaborati in modo sicuro tramite Stripe. Accettiamo tutte le principali carte di credito.
                        </Typography>
                        
                        <Typography variant="subtitle1" fontWeight="bold">
                            Posso disdire in qualsiasi momento?
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sì, puoi annullare il tuo abbonamento in qualsiasi momento dalla tua area personale.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            È previsto un periodo di prova?
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Al momento non offriamo periodi di prova, ma garantiamo un rimborso completo entro 14 giorni se non sei soddisfatto.
                        </Typography>
                        
                        <Typography variant="subtitle1" fontWeight="bold">
                            Come posso ottenere assistenza?
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Per qualsiasi domanda relativa agli abbonamenti, contattaci via email a supporto@edilconnect.it o tramite la sezione Assistenza.
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Subscription; 