// /pages/api/register.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      // Si l'utilisateur existe déjà ou autre erreur
      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.status(201).json(data);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
    }
  } else {
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}