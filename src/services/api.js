export const API_BASE_URL = 'https://matinducoin-backend-b2f47bd8118b.herokuapp.com/api';

// Récupérer un article par ID
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

// Récupérer un produit par ID
export const fetchProduct = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Produit non trouvé');
    }
    return response.json();
  } catch (error) {
    throw new Error(`Erreur lors de la récupération du produit: ${error.message}`);
  }
};

// Récupérer plusieurs produits associés
export const fetchRelatedProducts = async (productIds) => {
  try {
    const relatedPromises = productIds.map(async (id) => {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) {
        throw new Error(`Produit avec l'ID ${id} non trouvé`);
      }
      return response.json();
    });

    return Promise.all(relatedPromises);
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des produits associés: ${error.message}`);
  }
};
