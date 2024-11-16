// pages/api/auth/register.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      // Si le backend renvoie une erreur (ex: utilisateur existe déjà)
      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      // Le backend devrait renvoyer le token après l'inscription réussie
      res.status(201).json(data);
      
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Erreur lors de l\'inscription' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}