import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './components/Home';
import Auth from './components/Auth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import { LanguageProvider } from './contexts/LanguageContext';
import './App.css';

// Configurazione del router con future flags
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Auth />
  },
  {
    path: "/dashboard/*",
    element: <Dashboard />
  },
  {
    path: "/settings",
    element: <Settings />
  }
]);

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </LanguageProvider>
  );
}

export default App; 