export default async function handler(req, res) {
    const { id } = req.query;
  
    if (req.method === 'GET') {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}`);
        
        if (!response.ok) {
          throw new Error(`Article non trouvé: ${response.status}`);
        }
        
        const article = await response.json();
        res.status(200).json(article);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'article:', error);
        res.status(500).json({ error: 'Unable to fetch article' });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }