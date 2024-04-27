import { MongoClient } from 'mongodb';
import { Category } from '../domain/Category';
import { CategoryRepositoryI } from './CategoryRepositoryI';
import { HttpStatusCode } from '../domain/HttpStatusCode';
import { Boom } from '@hapi/boom';

export interface CategoryRepositoryProps {
  mongoClient: MongoClient;
  colletionName: string;
  databaseName: string;
}

export class CategoryRepositoryImpl implements CategoryRepositoryI {
  constructor(private props: CategoryRepositoryProps) {}

  async findAll(): Promise<Category[]> {
    await this.props.mongoClient.connect();
    const database = this.props.mongoClient.db(this.props.databaseName);
    const categoryCollection = database.collection(this.props.colletionName);
    const categories = await categoryCollection.find().toArray();
    this.props.mongoClient.close();

    if (!categories.length) {
      throw new Boom('Categories not found', {
        statusCode: HttpStatusCode.NOT_FOUND,
      });
    }

    return categories.map(
      (category) =>
        new Category({
          id: category._id,
          name: category.name,
        }),
    );
  }
}
