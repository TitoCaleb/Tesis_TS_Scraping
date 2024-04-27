import {
  productsService,
  storesService,
  scrapservice,
  categoryService,
} from '../services';
import { CategoryController } from './CategoryController';
import { ProductsController } from './ProductsController';
import { ScrapeController } from './ScrapeController';
import { StoresController } from './StoresController';

export const storesController = new StoresController({
  service: storesService,
});

export const productsController = new ProductsController({
  service: productsService,
});

export const scrapeController = new ScrapeController({
  service: scrapservice,
});

export const categoryController = new CategoryController({
  service: categoryService,
});
