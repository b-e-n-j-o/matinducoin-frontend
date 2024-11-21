// pages/api/utils/dbConnect.js

import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Veuillez définir la variable MONGODB_URI');
}

const uri = process.env.MONGODB_URI;
let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(); // Utilisera la base de données spécifiée dans l'URI

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export default connectToDatabase;
