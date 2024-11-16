export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Appel au backend séparé
      const response = await fetch('http://localhost:5001/api/articles');
      const articles = await response.json();

      res.status(200).json(articles);
    } catch (error) {
      console.error('Erreur lors de la récupération des articles :', error);
      res.status(500).json({ error: 'Unable to fetch articles' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
