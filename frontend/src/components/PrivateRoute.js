import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly }) => {
    const { token, isAuthenticated, user } = useAuth();
    const location = useLocation();

    console.log('PrivateRoute - Token:', token);
    console.log('PrivateRoute - Location:', location.pathname);
    console.log('PrivateRoute - IsAuthenticated:', isAuthenticated());
    console.log('PrivateRoute - User:', user);
    console.log('PrivateRoute - AdminOnly:', adminOnly);

    // Se non c'è un token o l'utente non è autenticato, reindirizza al login
    if (!token || !isAuthenticated()) {
        console.log('No token found or user not authenticated, redirecting to login');
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // Se la route richiede accesso admin e l'utente non è admin
    if (adminOnly && (!user || (user.role !== 'admin' && !user.isAdmin))) {
        console.log('User is not an admin, redirecting to home');
        return <Navigate to="/" replace />;
    }

    console.log('Access granted, rendering protected content');
    // Se c'è un token e l'utente è autenticato (e admin se richiesto), mostra il componente children o l'Outlet
    return children || <Outlet />;
};

export default PrivateRoute; 