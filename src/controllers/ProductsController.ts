import { Request } from 'express';
import { ProductsServiceI } from '../services/ProductsServiceI';
import { ScrapingServiceI } from '../services/ScrapingServiceI';
import { initDataBase } from '../database/config';

export interface ProductsControllerProps {
  service: ProductsServiceI;
  scrapservice: ScrapingServiceI;
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

  async scrape() {
    await initDataBase();
    await this.props.scrapservice.scrapeCyC();
    await this.props.scrapservice.scrapeSercoplus();
    /* await this.props.scrapservice.scrapeImpacto(); */
  }
}
