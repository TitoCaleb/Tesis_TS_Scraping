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
    try {
      const response = this.props.productsRepository.findAll(req);
      return response;
    } catch (error) {
      console.error(error);
    }
  }
  findByName(req: Request): Promise<Product[]> {
    try {
      const response = this.props.productsRepository.findByName(req);
      return response;
    } catch (error) {}
  }

  findByCategory(req: Request): Promise<Product[]> {
    try {
      const response = this.props.productsRepository.findByCategory(req);
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}
