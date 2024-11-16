// pages/api/test-connection.js

export default async function handler(req, res) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/test-connection`);
    
    if (!response.ok) {
      throw new Error('Échec de la connexion au backend');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Test connection error:', error);
    res.status(500).json({ 
      error: "Échec de la connexion au backend", 
      details: error.message 
    });
  }
}