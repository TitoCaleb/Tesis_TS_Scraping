import { ObjectId } from 'mongodb';
import { Store } from './Store';

export class Product {
  id: string | ObjectId;

  imgSrc?: string;

  dataOriginal?: string;

  imgAlt: string;

  priceDolar: string;

  priceSoles: string;

  url: string;

  tienda: Store;

  constructor(data?: Partial<Product>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
