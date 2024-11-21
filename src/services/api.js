// src/services/api.js
export const API_BASE_URL = 'https://matinducoin-backend-b2f47bd8118b.herokuapp.com/api';

export const fetchArticle = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`);
    if (!response.ok) {
      throw new Error('Article non trouvé');
    }
    return response.json();
  } catch (error) {
    throw new Error(`Erreur lors de la récupération de l'article: ${error.message}`);
  }
};