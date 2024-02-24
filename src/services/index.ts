import { ProductsServiceImpl } from './ProductsServiceImpl';
import { StoresServiceImpl } from './StoresServiceImpl';
import {
  productsRepository,
  storesRepository,
  scrapingRepository,
} from '../repository';
import { ScrapingServiceImpl } from './ScrapingServiceImpl';

export const productsService = new ProductsServiceImpl({
  productsRepository,
});

export const storesService = new StoresServiceImpl({
  storesRepository,
});

export const scrapservice = new ScrapingServiceImpl({
  scrapingRepository,
  storesRepository,
});
