import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'connect';
const collectionName = process.env.MONGODB_COLL || 'subscribers';

// Re-use the MongoDB client across function calls (Vercel optimization)
let cachedClient = null;

async function connectToMongo() {
  if (cachedClient && cachedClient.topology?.isConnected()) {
    return cachedClient;
  }

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { email, source } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email requis' });
  }

  try {
    const client = await connectToMongo();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.insertOne({
      email: email.trim().toLowerCase(),
      source: source || req.headers.origin || 'unknown',
      subscribed_at: new Date().toISOString(),
    });

    return res.status(200).json({ status: 'success' });
  } catch (err) {
    console.error('Erreur MongoDB:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
