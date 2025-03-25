import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/users', { email, password, name, profession });
      localStorage.setItem('token', response.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Registrazione fallita. Riprova.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-logo">EdilConnect</h2>
        <h3>Registrati</h3>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Professione</label>
            <select
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              required
            >
              <option value="">Seleziona una professione</option>
              <option value="Architetto">Architetto</option>
              <option value="Ingegnere">Ingegnere</option>
              <option value="Geometra">Geometra</option>
              <option value="Imprenditore">Imprenditore</option>
            </select>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Registrati
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