import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAuthenticated = localStorage.getItem('token') !== null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <Logo width="150" height="40" />
        </Link>
      </div>
      {isHome ? (
        <div className="navbar-menu">
          <a href="#servizi" className="navbar-item">
            <i className="fas fa-tools"></i>
            SERVIZI
          </a>
          <a href="#funzionalita" className="navbar-item">
            <i className="fas fa-list-ul"></i>
            FUNZIONALITÀ
          </a>
          <a href="#chi-siamo" className="navbar-item">
            <i className="fas fa-info-circle"></i>
            CHI SIAMO
          </a>
          {isAuthenticated ? (
            <Link to="/dashboard" className="navbar-item">
              <i className="fas fa-chart-line"></i>
              DASHBOARD
            </Link>
          ) : (
            <>
              <Link to="/login" className="navbar-item">
                <i className="fas fa-sign-in-alt"></i>
                ACCEDI
              </Link>
              <Link to="/register" className="navbar-item register-button">
                <i className="fas fa-user-plus"></i>
                REGISTRATI
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="navbar-menu">
          <Link to="/dashboard" className="navbar-item">
            <i className="fas fa-chart-line"></i>
            DASHBOARD
          </Link>
          <Link to="/subscriptions" className="navbar-item">
            <i className="fas fa-credit-card"></i>
            ABBONAMENTI
          </Link>
          <Link to="/profile" className="navbar-item">
            <i className="fas fa-user-circle"></i>
            PROFILO
          </Link>
          <button onClick={handleLogout} className="navbar-item logout-button">
            <i className="fas fa-sign-out-alt"></i>
            LOGOUT
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 