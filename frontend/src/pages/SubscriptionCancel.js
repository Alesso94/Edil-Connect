import React from 'react';
import { Container, Box, Typography, Button, Paper } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';

const SubscriptionCancel = () => {
  const navigate = useNavigate();

  const goToSubscription = () => {
    navigate('/subscription');
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CancelIcon sx={{ fontSize: 80, color: 'error.main', mb: 2, opacity: 0.8 }} />
          
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Pagamento Annullato
          </Typography>
          
          <Typography variant="h6" color="text.secondary" paragraph>
            Hai annullato il processo di pagamento. Nessun addebito è stato effettuato.
          </Typography>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={goToSubscription}
              sx={{ px: 3 }}
            >
              Riprova
            </Button>
            
            <Button 
              variant="outlined" 
              size="large"
              onClick={goToDashboard}
              sx={{ px: 3 }}
            >
              Torna alla Dashboard
            </Button>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
            Se hai riscontrato problemi durante il processo di pagamento, contatta il nostro supporto.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SubscriptionCancel; 