import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'connect';
const collectionName = process.env.MONGODB_COLL || 'subscribers';

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
  try {
    const client = await connectToMongo();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const subscribers = await collection.find({}, {
      projection: { _id: 0 }
    }).toArray();

    res.status(200).json(subscribers);
  } catch (err) {
    console.error('Erreur chargement:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
