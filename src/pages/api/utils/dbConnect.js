// pages/api/utils/dbConnect.js

import mongoose from 'mongoose';

let isConnected = false; // Suivi de l'état de connexion

export async function connectToDatabase() {
  if (isConnected) {
    return { db: mongoose.connection };
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log('Connexion réussie à MongoDB');

    return { db: mongoose.connection };
  } catch (error) {
    console.error('Erreur de connexion à MongoDB :', error);
    throw new Error('Erreur de connexion à MongoDB');
  }
}

export default connectToDatabase; // Assurez-vous que cette ligne est présente
