import { Request } from 'express';
import { Product } from '../domain/Product';

export interface ProductsRepositoryI {
  findAll(limit: Request): Promise<Product[]>;
  findByName(name: Request): Promise<Product[]>;
}
