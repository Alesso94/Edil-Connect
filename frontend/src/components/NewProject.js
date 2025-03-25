import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './NewProject.css';

const NewProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    client: '',
    budget: '',
    address: '',
    city: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post('http://localhost:3001/api/projects', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Redirect to projects page on success
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.response?.data?.message || 'Si è verificato un errore durante la creazione del progetto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-project">
      <div className="new-project-container">
        <h2>Crea Nuovo Progetto</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome Progetto*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Descrizione</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Data di Inizio*</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endDate">Data di Fine Prevista</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="client">Cliente*</label>
            <input
              type="text"
              id="client"
              name="client"
              value={formData.client}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="budget">Budget (€)</label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Indirizzo</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="city">Città</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/dashboard')}>
              Annulla
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creazione in corso...' : 'Crea Progetto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProject; 