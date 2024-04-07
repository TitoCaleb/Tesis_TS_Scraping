import { Store, UrlStore } from '../domain/Store';

export interface ScrapingRepositoryI {
  scrapCyC(store: Store, url: UrlStore): Promise<void>;
  scrapImpacto(store: Store, url: UrlStore): Promise<void>;
  scrapSercoPlus(store: Store, url: UrlStore): Promise<void>;
}
