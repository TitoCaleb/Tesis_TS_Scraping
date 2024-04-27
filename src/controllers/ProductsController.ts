import { Request } from 'express';
import { ProductsServiceI } from '../services/ProductsServiceI';

export interface ProductsControllerProps {
  service: ProductsServiceI;
}

export class ProductsController {
  constructor(private props: ProductsControllerProps) {}

  async findAll(request: Request) {
    const response = await this.props.service.findAll(request);
    return response;
  }

  async findByName(request: Request) {
    const response = await this.props.service.findByName(request);
    return response;
  }

  async findByCategory(request: Request) {
    const response = await this.props.service.findByCategory(request);
    return response;
  }
}
