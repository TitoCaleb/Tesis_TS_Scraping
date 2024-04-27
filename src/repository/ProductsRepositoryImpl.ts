import { Request } from 'express';
import { Product } from '../domain/Product';
import { ProductsRepositoryI } from './ProductsRepositoryI';
import { Boom } from '@hapi/boom';
import { MongoClient } from 'mongodb';
import { HttpStatusCode } from '../domain/HttpStatusCode';

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
      throw new Boom('Products not found', {
        statusCode: HttpStatusCode.NOT_FOUND,
      });
    }

    return products.map(
      (product) =>
        new Product({
          id: product._id,
          imgAlt: product.imgAlt,
          imgSrc: product.imgSrc ?? product.dataOriginal,
          priceDolar: product.priceDolar,
          priceSoles: product.priceSoles,
          url: product.url,
          tienda: product.tienda,
          dataOriginal: product.dataOriginal,
          categoria: product.categoria,
        }),
    );
  }

  async findByName({ query }: Request): Promise<Product[]> {
    await this.props.mongoClient.connect();
    const database = this.props.mongoClient.db(this.props.databaseName);
    const productsCollection = database.collection(this.props.colletionName);
    const products = await productsCollection
      .find({ imgAlt: query.name })
      .skip(Number(query.offset))
      .limit(Number(query.limit))
      .toArray();

    if (!products) {
      throw new Boom('Product not found', {
        statusCode: HttpStatusCode.NOT_FOUND,
      });
    }

    return products.map(
      (product) =>
        new Product({
          id: product._id,
          imgAlt: product.imgAlt,
          imgSrc: product.imgSrc ?? product.dataOriginal,
          priceDolar: product.priceDolar,
          priceSoles: product.priceSoles,
          url: product.url,
          tienda: product.tienda,
          categoria: product.categoria,
          dataOriginal: product.dataOriginal,
        }),
    );
  }

  async findByCategory({ query }: Request): Promise<Product[]> {
    await this.props.mongoClient.connect();
    const database = this.props.mongoClient.db(this.props.databaseName);
    const productsCollection = database.collection(this.props.colletionName);
    const products = await productsCollection
      .find({ categoria: query.categoria })
      .skip(Number(query.offset))
      .limit(Number(query.limit))
      .toArray();

    if (!products) {
      throw new Boom('Product not found', {
        statusCode: HttpStatusCode.NOT_FOUND,
      });
    }
    return products.map(
      (product) =>
        new Product({
          id: product._id,
          imgAlt: product.imgAlt,
          imgSrc: product.imgSrc ?? product.dataOriginal,
          priceDolar: product.priceDolar,
          priceSoles: product.priceSoles,
          url: product.url,
          tienda: product.tienda,
          categoria: product.categoria,
          dataOriginal: product.dataOriginal,
        }),
    );
  }
}
