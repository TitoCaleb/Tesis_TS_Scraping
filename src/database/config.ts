import { MongoClient } from 'mongodb';
import { storeList } from './stores.js';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

const MONGO_URI = `mongodb://${config.user}:${config.password}@localhost:27017?authSource=admin&readPreference=primary`;

export default MONGO_URI;

export const initDataBase = async () => {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const database = client.db('tesis');
    const collections = await database.listCollections().toArray();
    let collectionStore = collections.find(
      (collection) => collection.name === 'stores',
    );

    let collectionProducts = collections.find(
      (collection) => collection.name === 'products',
    );

    if (collectionProducts) {
      console.log('[INIT DB] No se creo Products porque ya existe');
    } else {
      console.log('[INIT DB] Creado Collection Products');
      await database.createCollection('products');
    }

    if (collectionStore) {
      console.log('[INIT DB] No se creo Stores porque ya existe');
      const stores = database.collection('stores');
      const storesData = await stores.find().toArray();
      if (!storesData.length) {
        console.log('[INIT DB] Insertando datos en Stores');
        await stores.insertMany(storeList);
      }
      return;
    }

    console.log('[INIT DB] Creado Collection Stores');
    await database.createCollection('stores');

    const stores = database.collection('stores');

    console.log('[INIT DB] Insertando datos en Stores');
    await stores.insertMany(storeList);
  } finally {
    await client.close();
  }
};
