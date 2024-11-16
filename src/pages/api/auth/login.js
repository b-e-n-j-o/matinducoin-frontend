// pages/api/auth/login.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      // On suppose que le backend renvoie déjà un token JWT
      res.status(200).json(data);
      
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Erreur de connexion au serveur' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}