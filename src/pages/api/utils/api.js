const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchArticle(id) {
  const response = await fetch(`${BASE_URL}/api/articles/${id}`);
  if (!response.ok) {
    throw new Error('Article non trouvé');
  }
  return response.json();
}

export async function fetchProduct(id) {
  const response = await fetch(`${BASE_URL}/api/products/${id}`);
  if (!response.ok) {
    throw new Error('Produit non trouvé');
  }
  return response.json();
}
