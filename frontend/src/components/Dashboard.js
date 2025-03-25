import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import './Dashboard.css';
import Profile from './Profile';
import NewProject from './NewProject';

// Componente per la lista dei progetti
const ProjectsList = ({ projects, loading, error }) => {
  const { t } = useLanguage();
  
  if (loading) return <div className="loading">Caricamento progetti in corso...</div>;
  if (error) return <div className="error">Errore: {error}</div>;
  
  if (projects.length === 0) {
    return (
      <div className="no-projects">
        <h2>Nessun progetto disponibile</h2>
        <p>Crea il tuo primo progetto per iniziare a gestire i tuoi lavori</p>
        <Link to="/dashboard/nuovo-progetto" className="create-first-project">
          Crea Primo Progetto
        </Link>
      </div>
    );
  }
  
  return (
    <>
      <div className="content-header">
        <h1>{t.navbar.myProjects}</h1>
        <Link to="/dashboard/nuovo-progetto" className="new-project-btn">
          {t.navbar.newProject}
        </Link>
      </div>
      <div className="projects-grid">
        {projects.map(project => (
          <div className="project-card" key={project._id}>
            <div className="project-header">
              <h3>{project.name}</h3>
              <span className={`status ${project.status?.toLowerCase().replace(' ', '-') || 'in-corso'}`}>
                {project.status || 'In Corso'}
              </span>
            </div>
            <p className="project-description">{project.description || 'Nessuna descrizione disponibile'}</p>
            <div className="project-details">
              <div><span className="label">Cliente:</span> {project.client}</div>
              <div><span className="label">Data inizio:</span> {new Date(project.startDate).toLocaleDateString()}</div>
              {project.endDate && (
                <div><span className="label">Data fine prevista:</span> {new Date(project.endDate).toLocaleDateString()}</div>
              )}
              {project.budget && (
                <div><span className="label">Budget:</span> €{project.budget.toLocaleString()}</div>
              )}
            </div>
            <div className="project-progress">
              <div className="progress-bar">
                <div className="progress" style={{ width: `${project.progress || 0}%` }}></div>
              </div>
              <div>{project.progress || 0}% completato</div>
            </div>
            <div className="project-actions">
              <button className="view-btn">Visualizza</button>
              <button className="edit-btn">Modifica</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

// Componente principale Dashboard
const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  // Logica per il tab attivo
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/dashboard/profilo')) return 'profilo';
    if (path.includes('/dashboard/nuovo-progetto')) return 'nuovo-progetto';
    if (path === '/settings') return 'settings';
    return 'progetti';
  };
  
  const activeTab = getActiveTab();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await axios.get('http://localhost:3001/api/projects', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.response?.data?.message || 'Si è verificato un errore durante il caricamento dei progetti.');
        setLoading(false);
      }
    };
    
    // Carica i progetti solo se siamo nella tab progetti
    if (activeTab === 'progetti') {
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, [navigate, activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    window.location.href = '/';
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <a href="/" onClick={handleHomeClick} className="logo">{t.navbar.logo}</a>
        <div className="nav-links">
          <Link 
            to="/dashboard" 
            className={activeTab === 'progetti' ? 'active' : ''}
          >
            {t.navbar.myProjects}
          </Link>
          <Link 
            to="/dashboard/nuovo-progetto" 
            className={activeTab === 'nuovo-progetto' ? 'active' : ''}
          >
            {t.navbar.newProject}
          </Link>
          <Link 
            to="/dashboard/profilo" 
            className={activeTab === 'profilo' ? 'active' : ''}
          >
            {t.navbar.profile}
          </Link>
          <Link 
            to="/settings" 
            className={activeTab === 'settings' ? 'active' : ''}
          >
            {t.navbar.settings}
          </Link>
          <button onClick={handleLogout} className="logout-btn">{t.navbar.logout}</button>
        </div>
      </nav>
      
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<ProjectsList projects={projects} loading={loading} error={error} />} />
          <Route path="/profilo" element={<Profile />} />
          <Route path="/nuovo-progetto" element={<NewProject />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard; 