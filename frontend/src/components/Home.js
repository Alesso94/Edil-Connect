import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const isAuthenticated = localStorage.getItem('token') !== null;

  return (
    <div className="home">
      <nav className="home-nav">
        <div className="nav-content">
          <div className="logo">EdilConnect</div>
          <div className="nav-links">
            <a href="#servizi">Servizi</a>
            <a href="#funzionalita">Funzionalità</a>
            <a href="#chi-siamo">Chi Siamo</a>
            {isAuthenticated ? (
              <Link to="/dashboard" className="login-btn">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="login-btn">Accedi</Link>
                <Link to="/register" className="register-btn">Registrati</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Gestisci i tuoi progetti edilizi in modo intelligente</h1>
          <p>La piattaforma all-in-one per professionisti dell'edilizia: architetti, ingegneri, geometri e imprenditori</p>
          <div className="hero-buttons">
            {isAuthenticated ? (
              <Link to="/dashboard" className="cta-button">Vai alla Dashboard</Link>
            ) : (
              <Link to="/register" className="cta-button">Inizia Gratuitamente</Link>
            )}
            <a href="#demo" className="demo-button">Guarda la Demo</a>
          </div>
        </div>
      </section>

      <section id="servizi" className="services">
        <h2>I Nostri Servizi</h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">📋</div>
            <h3>Gestione Progetti</h3>
            <p>Organizza e monitora tutti i tuoi progetti edilizi in un'unica piattaforma</p>
          </div>
          <div className="service-card">
            <div className="service-icon">👥</div>
            <h3>Collaborazione Team</h3>
            <p>Collabora in tempo reale con il tuo team e i tuoi partner</p>
          </div>
          <div className="service-card">
            <div className="service-icon">📊</div>
            <h3>Monitoraggio Progressi</h3>
            <p>Tieni traccia dell'avanzamento dei lavori e del budget in tempo reale</p>
          </div>
          <div className="service-card">
            <div className="service-icon">📱</div>
            <h3>Accesso Mobile</h3>
            <p>Gestisci i tuoi progetti ovunque tu sia, da qualsiasi dispositivo</p>
          </div>
        </div>
      </section>

      <section id="funzionalita" className="features">
        <h2>Funzionalità Principali</h2>
        <div className="features-container">
          <div className="feature">
            <div className="placeholder-image">Dashboard</div>
            <div className="feature-content">
              <h3>Dashboard Intuitiva</h3>
              <p>Visualizza tutti i tuoi progetti e le attività in un'unica schermata</p>
              <ul>
                <li>Panoramica progetti in tempo reale</li>
                <li>Gestione task e scadenze</li>
                <li>Indicatori di performance</li>
              </ul>
            </div>
          </div>
          <div className="feature reverse">
            <div className="feature-content">
              <h3>Gestione Documenti</h3>
              <p>Organizza e condividi facilmente tutti i documenti di progetto</p>
              <ul>
                <li>Archiviazione sicura</li>
                <li>Controllo versioni</li>
                <li>Condivisione semplificata</li>
              </ul>
            </div>
            <div className="placeholder-image">Documenti</div>
          </div>
        </div>
      </section>

      <section id="chi-siamo" className="about">
        <div className="about-content">
          <h2>Chi Siamo</h2>
          <p>EdilConnect nasce dall'esigenza di semplificare la gestione dei progetti edilizi, offrendo uno strumento completo e intuitivo per tutti i professionisti del settore.</p>
          <div className="stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Progetti Gestiti</span>
            </div>
            <div className="stat">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Utenti Attivi</span>
            </div>
            <div className="stat">
              <span className="stat-number">98%</span>
              <span className="stat-label">Clienti Soddisfatti</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>EdilConnect</h4>
            <p>La piattaforma per i professionisti dell'edilizia</p>
          </div>
          <div className="footer-section">
            <h4>Link Utili</h4>
            <a href="#servizi">Servizi</a>
            <a href="#funzionalita">Funzionalità</a>
            <a href="#chi-siamo">Chi Siamo</a>
          </div>
          <div className="footer-section">
            <h4>Contatti</h4>
            <p>Email: info@edilconnect.it</p>
            <p>Tel: +39 XXX XXX XXXX</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 EdilConnect. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home; 