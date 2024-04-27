import { initDataBase } from '../database/config';
import { ScrapingServiceI } from '../services/ScrapingServiceI';

export interface ScrapeControllerProps {
  service: ScrapingServiceI;
}

export class ScrapeController {
  constructor(private props: ScrapeControllerProps) {}

  async scrape() {
    await initDataBase();
    /* await this.props.scrapservice.scrapeCyC();
    await this.props.scrapservice.scrapeSercoplus();
    await this.props.scrapservice.scrapeImpacto(); */
  }
}
