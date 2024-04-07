import { StoreNames } from '../database/stores';
import { ScrapingRepositoryI } from '../repository/ScrapingRepositoryI';
import { StoresRepositoryI } from '../repository/StoresRepositoryI';
import { ScrapingServiceI } from './ScrapingServiceI';

interface ScrapingServiceImplProps {
  scrapingRepository: ScrapingRepositoryI;
  storesRepository: StoresRepositoryI;
}

export class ScrapingServiceImpl implements ScrapingServiceI {
  constructor(private props: ScrapingServiceImplProps) {}

  private async findStore(name: string) {
    const stores = await this.props.storesRepository.findAll();
    return stores.find((store) => store.name === name);
  }

  async scrapeCyC(): Promise<void> {
    try {
      const store = await this.findStore(StoreNames.CYC);

      if (!store) {
        throw new Error('Store not found');
      }
      console.time('Scraping: scrapeCyC');

      for (const url of store.urls) {
        await this.props.scrapingRepository.scrapCyC(store, url);
      }
      console.timeEnd('Scraping: scrapeCyC');
    } catch (error) {
      throw new Error(
        `[ScrapingService] Error al hacer scraping: ${error.message}`,
      );
    }
  }

  async scrapeSercoplus(): Promise<void> {
    try {
      const store = await this.findStore(StoreNames.SERCOPLUS);

      if (!store) {
        throw new Error('Store not found');
      }

      console.time('Scraping: scrapeSercoplus');

      for (const url of store.urls) {
        await this.props.scrapingRepository.scrapSercoPlus(store, url);
      }
      console.timeEnd('Scraping: scrapeSercoplus');
    } catch (error) {
      throw new Error(
        `[ScrapingService] Error al hacer scraping: ${error.message}`,
      );
    }
  }

  async scrapeImpacto(): Promise<void> {
    try {
      const store = await this.findStore(StoreNames.IMPACTO);

      if (!store) {
        throw new Error('Store not found');
      }

      console.time('Scraping: scrapeImpacto');

      for (const url of store.urls) {
        await this.props.scrapingRepository.scrapImpacto(store, url);
      }
      console.timeEnd('Scraping: scrapeImpacto');
    } catch (error) {
      throw new Error(
        `[ScrapingService] Error al hacer scraping: ${error.message}`,
      );
    }
  }
}
