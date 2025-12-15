import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'connect';
const collectionName = process.env.MONGODB_COLL || 'subscribers';
const exportSecret = process.env.EXPORT_SECRET;

// Reuse client across invocations (Vercel optimization)
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
  const { auth } = req.query;

  if (auth !== exportSecret) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  try {
    const client = await connectToMongo();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const subscribers = await collection.find().toArray();

    const csv = [
      'email,source,subscribed_at',
      ...subscribers.map(s =>
        `${s.email},${s.source},${s.subscribed_at}`
      )
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="subscribers.csv"');
    res.status(200).send(csv);
  } catch (err) {
    console.error('Erreur export:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
