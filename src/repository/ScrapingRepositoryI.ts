import { Store } from '../domain/Store';

export interface ScrapingRepositoryI {
  scrapCyC(store: Store): Promise<void>;
  scrapImpacto(store: Store): Promise<void>;
  scrapSercoPlus(store: Store): Promise<void>;
}
