import { ProductsServiceImpl } from './ProductsServiceImpl';
import { StoresServiceImpl } from './StoresServiceImpl';
import {
  productsRepository,
  storesRepository,
  scrapingRepository,
  categoryRepository,
} from '../repository';
import { ScrapingServiceImpl } from './ScrapingServiceImpl';
import { CategoryServiceImpl } from './CategoryServiceImpl';

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

export const categoryService = new CategoryServiceImpl({
  categoryRepository,
});
