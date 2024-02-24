import { Request } from 'express';
import { Product } from '../domain/Product';
import { ProductsRepositoryI } from './ProductsRepositoryI';
import { Boom } from '@hapi/boom';
import { MongoClient } from 'mongodb';

export interface ProductsRepositoryProps {
  mongoClient: MongoClient;
  colletionName: string;
  databaseName: string;
}

export class ProductsRepositoryImpl implements ProductsRepositoryI {
  constructor(private props: ProductsRepositoryProps) {}

  async findAll({ query }: Request): Promise<Product[]> {
    await this.props.mongoClient.connect();
    const database = this.props.mongoClient.db(this.props.databaseName);
    const productsCollection = database.collection(this.props.colletionName);
    const products = await productsCollection
      .find()
      .skip(Number(query.offset))
      .limit(Number(query.limit))
      .toArray();
    this.props.mongoClient.close();

    if (!products.length) {
      throw new Boom('Products not found', { statusCode: 404 });
    }

    return products.map(
      (product) =>
        new Product({
          id: product._id,
          imgAlt: product.imgAlt,
          priceDolar: product.priceDolar,
          priceSoles: product.priceSoles,
          url: product.url,
          tienda: product.tienda,
        }),
    );
  }

  async findByName({ query }: Request): Promise<Product[]> {
    await this.props.mongoClient.connect();
    const database = this.props.mongoClient.db(this.props.databaseName);
    const productsCollection = database.collection(this.props.colletionName);
    const products = await productsCollection
      .find({ imgAlt: query.name })
      .toArray();

    if (!products) {
      throw new Boom('Product not found', { statusCode: 404 });
    }

    return products.map(
      (product) =>
        new Product({
          id: product._id,
          imgAlt: product.imgAlt,
          priceDolar: product.priceDolar,
          priceSoles: product.priceSoles,
          url: product.url,
          tienda: product.tienda,
        }),
    );
  }
}
