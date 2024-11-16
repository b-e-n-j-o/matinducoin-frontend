// pages/api/test-connection.js
import { connectToDatabase } from '../../../../backend/utils/dbConnect.js';

export default async function handler(req, res) {
  try {
    const { client, db } = await connectToDatabase();
    await db.command({ ping: 1 });
    res.status(200).json({ message: "Successfully connected to MongoDB" });
  } catch (error) {
    res.status(500).json({ error: "Failed to connect to MongoDB", details: error.message });
  }
}