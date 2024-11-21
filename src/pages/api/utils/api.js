export async function fetchArticle(id) {
    const response = await fetch(`/api/articles/${id}`);
    if (!response.ok) {
      throw new Error('Article non trouvé');
    }
    return response.json();
  }
  
  export async function fetchProduct(id) {
    const response = await fetch(`/api/products/${id}`);
    if (!response.ok) {
      throw new Error('Produit non trouvé');
    }
    return response.json();
  }