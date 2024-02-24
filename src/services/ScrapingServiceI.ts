export interface ScrapingServiceI {
  scrapeCyC(): Promise<void>;
  scrapeSercoplus(): Promise<void>;
  scrapeImpacto(): Promise<void>;
}
