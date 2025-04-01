import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectForm from './pages/ProjectForm';
import Documents from './pages/Documents';
import Profile from './pages/Profile';
import VerifyEmail from './pages/VerifyEmail';
import AdminPanel from './pages/AdminPanel';
import Subscription from './pages/Subscription';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import FloatingAvatar from './components/FloatingAvatar';
 <Route path="/test-login" element={<TestLogin />} />
function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <AuthProvider>
                    <AppContent />
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

// Componente interno che può utilizzare useAuth in sicurezza
function AppContent() {
    const useAuth = require('./context/AuthContext').useAuth;
    const { user } = useAuth();
    
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/test-login" element={<TestLogin />} />
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />
                <Route path="/projects" element={
                    <PrivateRoute>
                        <Projects />
                    </PrivateRoute>
                } />
                <Route path="/projects/new" element={
                    <PrivateRoute>
                        <ProjectForm />
                    </PrivateRoute>
                } />
                <Route path="/projects/edit/:id" element={
                    <PrivateRoute>
                        <ProjectForm />
                    </PrivateRoute>
                } />
                <Route path="/documents" element={
                    <PrivateRoute>
                        <Documents />
                    </PrivateRoute>
                } />
                <Route path="/profile" element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                } />
                <Route path="/admin" element={
                    <PrivateRoute adminOnly>
                        <AdminPanel />
                    </PrivateRoute>
                } />
                
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            {user && <FloatingAvatar />}
        </>
    );
}

export default App;
