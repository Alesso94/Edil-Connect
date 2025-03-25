import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('admin@edilconnect.it');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');

  // Controllo se il backend è raggiungibile
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        setApiStatus('checking');
        console.log('Controllo se il backend è raggiungibile...');
        await axios.get('http://localhost:3001/api');
        setApiStatus('online');
        console.log('Backend online');
      } catch (err) {
        console.error('Backend non raggiungibile:', err);
        setApiStatus('offline');
      }
    };

    checkBackendStatus();
    
    // Ricontrolliamo ogni 5 secondi
    const interval = setInterval(checkBackendStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('Tentativo di login in corso...');
    setLoading(true);

    try {
      console.log('Tentativo di login con:', { email, password });
      
      // Controllo diretto del backend
      if (apiStatus !== 'online') {
        throw new Error('Il server backend non è raggiungibile. Riprova più tardi.');
      }
      
      const response = await axios.post('http://localhost:3001/api/auth/login', { email, password });
      console.log('Risposta dal server:', response.data);
      setSuccessMsg('Login riuscito! Reindirizzamento...');
      localStorage.setItem('token', response.data.token);
      
      // Breve timeout per mostrare il messaggio di successo
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (err) {
      console.error('Errore durante il login:', err);
      setLoading(false);
      
      if (err.response) {
        // Il server ha risposto con uno stato diverso da 2xx
        console.error('Risposta di errore dal server:', err.response.data);
        setError(err.response.data.message || 'Login fallito. Controlla email e password.');
      } else if (err.request) {
        // La richiesta è stata fatta ma non è stata ricevuta alcuna risposta
        console.error('Nessuna risposta ricevuta:', err.request);
        setError('Impossibile raggiungere il server. Verifica la connessione.');
      } else {
        // Si è verificato un errore nella configurazione della richiesta
        setError('Errore di richiesta: ' + err.message);
      }
    }
  };

  // Funzione per il login diretto con credenziali di test
  const handleTestLogin = () => {
    setEmail('admin@edilconnect.it');
    setPassword('password123');
    // Autologin dopo un breve timeout
    setTimeout(() => {
      document.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 500);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-logo">EdilConnect</h2>
        <h3>Accedi</h3>
        
        {apiStatus === 'offline' && (
          <div className="error-message">
            Il server backend non è raggiungibile. Verifica che sia in esecuzione.
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        {successMsg && <div className="success-message">{successMsg}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading || apiStatus === 'offline'}>
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>
        
        <div className="test-login-section">
          <p>Accedi con le credenziali di test:</p>
          <button 
            className="test-login-button" 
            onClick={handleTestLogin}
            disabled={loading || apiStatus === 'offline'}
          >
            Accedi come utente test
          </button>
          <div className="test-credentials">
            <p>Email: admin@edilconnect.it</p>
            <p>Password: password123</p>
          </div>
        </div>
        
        <p className="toggle-auth">
          Non hai un account? 
          <a href="/register" style={{ marginLeft: '5px', color: '#1e3c72' }}>
            Registrati
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login; 