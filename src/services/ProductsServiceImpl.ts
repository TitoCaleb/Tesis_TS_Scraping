import { Request } from 'express';
import { Product } from '../domain/Product';
import { ProductsRepositoryI } from '../repository/ProductsRepositoryI';
import { ProductsServiceI } from './ProductsServiceI';

interface ProductsServiceImplProps {
  productsRepository: ProductsRepositoryI;
}

export class ProductsServiceImpl implements ProductsServiceI {
  constructor(private props: ProductsServiceImplProps) {}

  findAll(req: Request): Promise<Product[]> {
    const response = this.props.productsRepository.findAll(req);
    return response;
  }
  findByName(req: Request): Promise<Product[]> {
    const response = this.props.productsRepository.findByName(req);
    return response;
  }
}
