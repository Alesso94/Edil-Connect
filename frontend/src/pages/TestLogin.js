import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';

const TestLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  const handleDebugLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setApiResponse(null);

    try {
      console.log('Tentativo di debug login con:', { email });
      const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('URL del backend:', backendUrl);

      const response = await axios.post(`${backendUrl}/api/users/debug-auth`, {
    email,
    password
  });

      console.log('Risposta debug login:', response.data);
      setSuccess('Login di debug riuscito!');
      setApiResponse(response.data);

      // Salva token nel localStorage per test
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

    } catch (error) {
      console.error('Errore nel debug login:', error);
      setError(`Errore: ${error.response?.data?.message || error.message}`);
      setApiResponse(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordDiagnostic = async () => {
    if (!email || !password) {
      setError("Inserisci email e password per la diagnostica");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    setApiResponse(null);
    
    try {
      const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${backendUrl}/api/users/debug-password`, {
        email,
        password
      });
      
      console.log('Risposta diagnostica:', response.data);
      setSuccess('Diagnostica password completata');
      setApiResponse(response.data);
    } catch (error) {
      console.error('Errore diagnostica:', error);
      setError(`Errore: ${error.response?.data?.message || error.message}`);
      setApiResponse(error.response?.data);
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetAdmin = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setApiResponse(null);
    
    try {
      const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${backendUrl}/api/users/create-admin`);
      
      console.log('Risposta reset admin:', response.data);
      setSuccess('Admin resettato con successo');
      setApiResponse(response.data);
      
      // Precompila i campi con le credenziali admin
      setEmail('admin@edilconnect.it');
      setPassword('admin123');
    } catch (error) {
      console.error('Errore reset admin:', error);
      setError(`Errore: ${error.response?.data?.message || error.message}`);
      setApiResponse(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Test Login (Debug)
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph align="center">
          Questa pagina è solo per scopi di test e debug.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleDebugLogin}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Test Login'}
          </Button>
        </form>
        
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handlePasswordDiagnostic}
            disabled={loading || !email || !password}
            fullWidth
          >
            Diagnostica Password
          </Button>
          
          <Button 
            variant="outlined" 
            color="warning" 
            onClick={handleResetAdmin}
            disabled={loading}
            fullWidth
          >
            Reset Admin
          </Button>
        </Box>

        {apiResponse && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Risposta API:
            </Typography>
            <Paper sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, overflow: 'auto', maxHeight: 300 }}>
              <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
            </Paper>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default TestLogin;
