import { productsService, storesService, scrapservice } from '../services';
import { ProductsController } from './ProductsController';
import { StoresController } from './StoresController';

export const storesController = new StoresController({
  service: storesService,
});

export const productsController = new ProductsController({
  service: productsService,
  scrapservice: scrapservice,
});
