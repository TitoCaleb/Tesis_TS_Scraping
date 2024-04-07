import { Boom } from '@hapi/boom';
import { Store } from '../domain/Store';
import { StoresRepositoryI } from './StoresRepositoryI';
import { MongoClient } from 'mongodb';

export interface StoresRepositoryProps {
  mongoClient: MongoClient;
  colletionName: string;
  databaseName: string;
}

export class StoresRepositoryImpl implements StoresRepositoryI {
  constructor(private props: StoresRepositoryProps) {}

  async findAll(): Promise<Store[]> {
    await this.props.mongoClient.connect();
    const database = this.props.mongoClient.db(this.props.databaseName);
    const storesCollection = database.collection(this.props.colletionName);
    const stores = await storesCollection.find().toArray();
    this.props.mongoClient.close();

    if (!stores.length) {
      throw new Boom('Stores not found', { statusCode: 404 });
    }

    return stores.map(
      (store) =>
        new Store({
          id: store._id,
          name: store.name,
          urls: store.urls,
        }),
    );
  }
}
