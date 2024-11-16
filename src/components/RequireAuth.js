import React from 'react';
import { useIsAuthenticated } from 'react-auth-kit';
import { Navigate } from 'react-router-dom';

// Ce composant vérifie si l'utilisateur est authentifié
const RequireAuth = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();  // Vérifie si l'utilisateur est authentifié

  if (!isAuthenticated()) {
    // Si non authentifié, redirige vers la page de connexion
    return <Navigate to="/login" />;
  }

  // Si authentifié, rend les enfants (routes protégées)
  return children;
};

export default RequireAuth;
