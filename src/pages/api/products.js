export default async function handler(req, res) {
    if (req.method === 'GET') {
      try {
        // Vérifiez que l'URL est définie
        if (!process.env.NEXT_PUBLIC_API_URL) {
          throw new Error('API URL non définie');
        }

        console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
        
        // Utilisez l'URL de votre backend, pas /api/products
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        
        res.status(200).json(products);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        res.status(500).json({ error: 'Unable to fetch products: ' + error.message });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }