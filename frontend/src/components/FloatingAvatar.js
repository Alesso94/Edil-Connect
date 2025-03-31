import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import '../styles/UserButton.css';

const FloatingAvatar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="floating-avatar">
      <button 
        className="floating-button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Menu di navigazione"
      >
        {user?.photoURL ? (
          <img 
            src={user.photoURL} 
            alt="Avatar" 
            className="floating-avatar-img"
          />
        ) : (
          <Avatar className="floating-avatar-img" sx={{ bgcolor: '#fff', color: '#1976d2' }}>
            {getInitials()}
          </Avatar>
        )}
      </button>

      {isMenuOpen && (
        <div className="floating-menu">
          <button onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}>
            <DashboardIcon style={{ marginRight: 10, fontSize: 20 }} /> Dashboard
          </button>
          <button onClick={() => { navigate('/projects'); setIsMenuOpen(false); }}>
            <FolderIcon style={{ marginRight: 10, fontSize: 20 }} /> Progetti
          </button>
          <button onClick={() => { navigate('/documents'); setIsMenuOpen(false); }}>
            <DescriptionIcon style={{ marginRight: 10, fontSize: 20 }} /> Documenti
          </button>
          <button onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}>
            <PersonIcon style={{ marginRight: 10, fontSize: 20 }} /> Profilo
          </button>
          <button onClick={() => { navigate('/subscription'); setIsMenuOpen(false); }}>
            <SubscriptionsIcon style={{ marginRight: 10, fontSize: 20 }} /> Piani Tariffari
          </button>
          {(user?.role === 'admin' || user?.isAdmin) && (
            <button onClick={() => { navigate('/admin'); setIsMenuOpen(false); }}>
              <AdminPanelSettingsIcon style={{ marginRight: 10, fontSize: 20 }} /> Pannello Admin
            </button>
          )}
          <button onClick={handleLogout}>
            <LogoutIcon style={{ marginRight: 10, fontSize: 20 }} /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default FloatingAvatar;