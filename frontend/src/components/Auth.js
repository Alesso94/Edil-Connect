import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

console.log('Backend URL:', process.env.REACT_APP_BACKEND_URL);

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [license, setLicense] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSuccess(false);

    try {
      console.log('Backend URL:', process.env.REACT_APP_BACKEND_URL);
      console.log('Dati inviati:', { email, password, name, profession, license, adminCode });

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
        email,
        password,
        name,
        profession,
        license,
        adminCode: adminCode || undefined
      });

      console.log('Risposta dal server:', response.data);
      setSuccess(true);

      // Salva il token nel localStorage
      localStorage.setItem('token', response.data.token);

      // Reindirizza l'utente alla dashboard dopo un breve delay
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);

    } catch (err) {
      console.error('Errore completo:', err);
      console.error('Risposta del server:', err.response?.data);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Errore di registrazione. Controlla la console per i dettagli.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-logo">EdilConnect</h2>
        <h3>Registrati</h3>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Registrazione completata! Reindirizzamento in corso...</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Professione</label>
            <select
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Seleziona una professione</option>
              <option value="Architetto">Architetto</option>
              <option value="Ingegnere">Ingegnere</option>
              <option value="Geometra">Geometra</option>
              <option value="Imprenditore">Imprenditore</option>
            </select>
          </div>
          <div className="form-group">
            <label>Licenza</label>
            <input
              type="text"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              required
              disabled={loading}
            />
          </div>
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
          <div className="form-group">
            <label>Codice Admin (opzionale)</label>
            <input
              type="password"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              placeholder="Inserisci il codice admin per registrarti come amministratore"
              disabled={loading}
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Registrazione in corso...' : 'Registrati'}
          </button>
        </form>
        <p className="toggle-auth">
          Hai già un account? 
          <a href="/login" style={{ marginLeft: '5px', color: '#1e3c72' }}>
            Accedi
          </a>
        </p>
      </div>
    </div>
  );
};

export default Auth;
