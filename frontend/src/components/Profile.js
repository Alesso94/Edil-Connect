import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    phone: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUser(response.data);
        setFormData({
          name: response.data.name || '',
          profession: response.data.profession || '',
          phone: response.data.phone || ''
        });
        setLoading(false);
      } catch (err) {
        console.error('Errore nel caricamento dei dati utente:', err);
        setError('Errore nel caricamento dei dati utente');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch('http://localhost:3001/api/users/me', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setEditMode(false);
    } catch (err) {
      console.error('Errore nell\'aggiornamento del profilo:', err);
      setError('Errore nell\'aggiornamento del profilo');
    }
  };

  // Funzione per tradurre il ruolo in italiano
  const getRoleInItalian = (role, isAdmin) => {
    if (isAdmin) return 'Amministratore';
    if (role === 'professional') return 'Professionista';
    return role; // Fallback
  };

  if (loading) {
    return <div className="profile-container loading">Caricamento profilo...</div>;
  }

  if (error) {
    return <div className="profile-container error">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Il Mio Profilo</h1>
        {!editMode && (
          <button className="edit-profile-btn" onClick={() => setEditMode(true)}>
            Modifica Profilo
          </button>
        )}
      </div>

      {!editMode ? (
        <div className="profile-info">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <div className="profile-details">
            <div className="detail-group">
              <h3>Informazioni Personali</h3>
              <div className="detail-row">
                <span className="detail-label">Nome:</span>
                <span className="detail-value">{user.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{user.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Professione:</span>
                <span className="detail-value">{user.profession || 'Non specificata'}</span>
              </div>
              {user.phone && (
                <div className="detail-row">
                  <span className="detail-label">Telefono:</span>
                  <span className="detail-value">{user.phone}</span>
                </div>
              )}
            </div>
            
            <div className="detail-group">
              <h3>Informazioni Account</h3>
              <div className="detail-row">
                <span className="detail-label">Ruolo:</span>
                <span className="detail-value">
                  {getRoleInItalian(user.role, user.isAdmin)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Account creato il:</span>
                <span className="detail-value">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              disabled
            />
            <small>L'email non può essere modificata</small>
          </div>
          <div className="form-group">
            <label>Professione</label>
            <select
              name="profession"
              value={formData.profession}
              onChange={handleInputChange}
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
            <label>Telefono</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">Salva</button>
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={() => {
                setFormData({
                  name: user.name || '',
                  profession: user.profession || '',
                  phone: user.phone || ''
                });
                setEditMode(false);
              }}
            >
              Annulla
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile; 