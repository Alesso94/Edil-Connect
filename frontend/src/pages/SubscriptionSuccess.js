import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, Paper, CircularProgress, Alert } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const SubscriptionSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const validateSubscription = async () => {
      try {
        // Ottieni session_id dai parametri dell'URL
        const queryParams = new URLSearchParams(location.search);
        const sessionId = queryParams.get('session_id');

        if (!sessionId) {
          setError('Parametri mancanti nella URL. Pagamento non verificato.');
          setLoading(false);
          return;
        }

        // Verifica lo stato della sessione di checkout (opzionale)
        const response = await axios.get(`/api/subscriptions/verify-session/${sessionId}`);
        setSubscription(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Errore nella verifica della sottoscrizione:', error);
        setError('Errore durante la verifica del pagamento. Il pagamento potrebbe essere stato completato, ma la verifica è fallita.');
        setLoading(false);
      }
    };

    validateSubscription();
  }, [location.search]);

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>
          Verifica del pagamento in corso...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {error ? (
          <Box sx={{ textAlign: 'center' }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Button variant="contained" onClick={goToDashboard}>
              Vai alla Dashboard
            </Button>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Abbonamento Attivato con Successo!
            </Typography>
            
            <Typography variant="h6" color="text.secondary" paragraph>
              Grazie per esserti abbonato a EdilConnect. Il tuo account è stato aggiornato con successo.
            </Typography>
            
            {subscription && (
              <Box sx={{ my: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, display: 'inline-block', textAlign: 'left' }}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Piano:</strong> {subscription.planName}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Stato:</strong> {subscription.status === 'active' ? 'Attivo' : 'In attesa'}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Valido fino a:</strong> {new Date(subscription.endDate).toLocaleDateString('it-IT')}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ mt: 4 }}>
              <Button 
                variant="contained" 
                size="large"
                onClick={goToDashboard}
                sx={{ px: 4 }}
              >
                Vai alla Dashboard
              </Button>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
              Riceverai a breve una email di conferma con i dettagli del tuo abbonamento.
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default SubscriptionSuccess; 