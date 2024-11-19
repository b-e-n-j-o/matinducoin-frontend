// src/utils/api.js

const getApiUrl = () => {
    // En production, utilise l'URL déployée
    if (process.env.NODE_ENV === 'production') {
      return process.env.NEXT_PUBLIC_API_URL || 'https://matinducoin-backend-b2f47bd8118b.herokuapp.com/';
    }
    // En développement, utilise localhost
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  };
  
  export const API_URL = getApiUrl();
  
  // Fonction utilitaire pour récupérer les produits
  export const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };
  
  // Fonction utilitaire pour récupérer un produit spécifique
  export const fetchProductById = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  };