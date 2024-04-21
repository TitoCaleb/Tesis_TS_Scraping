import { Request } from 'express';
import { Product } from '../domain/Product';

export interface ProductsServiceI {
  findAll(req: Request): Promise<Product[]>;

  findByName(req: Request): Promise<Product[]>;

  findByCategory(req: Request): Promise<Product[]>;
}
