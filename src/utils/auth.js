// utils/auth.js

// Récupère le token JWT depuis localStorage
export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  // Enregistre le token JWT dans localStorage
  export const setToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  // Supprime le token JWT de localStorage
  export const removeToken = () => {
    localStorage.removeItem('token');
  };
  