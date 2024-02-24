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
      const store = await this.findStore('C&C Computer');

      if (!store) {
        throw new Error('Store not found');
      }

      await this.props.scrapingRepository.scrapCyC(store);
    } catch (error) {
      throw new Error('[ScrapingService] Error al hacer scraping');
    }
  }

  async scrapeSercoplus(): Promise<void> {
    try {
      const store = await this.findStore('Sercoplus');

      if (!store) {
        throw new Error('Store not found');
      }

      await this.props.scrapingRepository.scrapSercoPlus(store);
    } catch (error) {
      throw new Error('[ScrapingService] Error al hacer scraping');
    }
  }

  async scrapeImpacto(): Promise<void> {
    try {
      const store = await this.findStore('Impacto');

      if (!store) {
        throw new Error('Store not found');
      }

      await this.props.scrapingRepository.scrapImpacto(store);
    } catch (error) {
      throw new Error('[ScrapingService] Error al hacer scraping');
    }
  }
}
