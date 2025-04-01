import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import axios from 'axios';

const StripeCheckoutButton = ({ planId, buttonText, variant = 'contained', size = 'large', fullWidth = false }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Chiamata all'API per creare una sessione di checkout
      const response = await axios.post('/api/subscriptions/create-checkout-session', {
        planId
      });

      // Ottieni la sessione di checkout
      const { sessionId, url } = response.data;

      // Reindirizza all'URL di checkout Stripe
      if (url) {
        window.location.href = url;
      } else {
        // Usa Stripe globale invece di loadStripe
        const stripe = window.Stripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Errore durante la creazione della sessione di checkout:', error);
      alert('Si è verificato un errore durante la procedura di checkout. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      onClick={handleCheckout}
      disabled={loading}
      sx={{ 
        px: 3,
        py: 1,
        position: 'relative'
      }}
    >
      {loading ? <CircularProgress size={24} sx={{ color: 'inherit' }} /> : buttonText || 'Abbonati ora'}
    </Button>
  );
};

export default StripeCheckoutButton; 