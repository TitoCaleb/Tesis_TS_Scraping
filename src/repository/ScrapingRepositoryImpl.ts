import { PuppeteerNode, type Page } from 'puppeteer';
import { ScrapingRepositoryI } from './ScrapingRepositoryI';
import { Store } from '../domain/Store';
import { MongoClient } from 'mongodb';
import { Product } from '../domain/Product';

export interface ScrapingRepositoryProps {
  mongoClient: MongoClient;
  puppeteerClient: PuppeteerNode;
  colletionName: string;
  databaseName: string;
}

export class ScrapingRepositoryImpl implements ScrapingRepositoryI {
  constructor(private props: ScrapingRepositoryProps) {}

  private async configScraping(url: string) {
    const browser = await this.props.puppeteerClient.launch({
      headless: 'shell',
    });
    const page = await browser.newPage();
    await page.goto(url);
    return {
      browser,
      page,
    };
  }

  private async saveData(cardInfo: any[], store: Store) {
    try {
      const database = this.props.mongoClient.db(this.props.databaseName);
      const productsCollection = database.collection(this.props.colletionName);

      const products = cardInfo.map(
        (product) =>
          new Product({
            imgAlt: product.imgAlt,
            imgSrc: product.imgSrc,
            priceDolar: product.priceDolar,
            priceSoles: product.priceSoles,
            url: product.url,
            dataOriginal: product.dataOriginal,
            tienda: store,
          }),
      );

      await productsCollection.insertMany(products);
      return products;
    } catch (error) {
      throw new Error('[saveData] Error al guardar los datos');
    }
  }

  private async scrapyCardCyC(page: Page) {
    const cardInfo = await page.$$eval('.product-miniature', (elements) => {
      return elements.map((element) => {
        const imgSrc = element
          ?.querySelector('.product-thumbnail img')
          ?.getAttribute('src');
        const url = element
          ?.querySelector('.laberProduct-image a')
          ?.getAttribute('href');
        const imgAlt = element
          ?.querySelector('.product-thumbnail img')
          ?.getAttribute('alt');
        const priceElements = element.querySelectorAll(
          '.laber-product-price-and-shipping .price',
        );
        const prices = Array.from(priceElements).map(
          (span) => span.textContent,
        );
        const priceDolar = prices.length === 0 ? null : prices[0];
        const priceSoles =
          prices.length === 0 ? null : prices[1]?.toString().slice(2, -2);

        return {
          imgSrc,
          dataOriginal: null,
          imgAlt,
          priceDolar,
          priceSoles,
          url,
        };
      });
    });

    return cardInfo;
  }

  private async scrapyCardImpacto(page: Page) {
    const cardInfo = await page.$$eval('.single-product', (elements) => {
      return elements.map((element) => {
        const imgSrc = element
          ?.querySelector('.product-image img')
          ?.getAttribute('src');
        const url = element
          .querySelector('.product-image a')
          ?.getAttribute('href');
        const imgAlt = element
          ?.querySelector('.product-image img')
          ?.getAttribute('alt');
        const priceSale = element
          ?.querySelector('.price-sale-2')
          ?.textContent?.trim();
        const [priceDolar, priceSoles] = priceSale!
          .split('-')
          .map((value) => value.trim());

        return {
          imgSrc,
          dataOriginal: null,
          imgAlt,
          priceDolar,
          priceSoles,
          url,
        };
      });
    });

    return cardInfo;
  }

  private async scrapyCardSercoPlus(page: Page) {
    const cardInfo = await page.$$eval('.product-miniature', (elements) => {
      return elements.map((element) => {
        const imgSrc = element
          ?.querySelector('.product-thumbnail img')
          ?.getAttribute('src');
        const dataOriginal = element
          ?.querySelector('.product-thumbnail img')
          ?.getAttribute('data-original');
        const url = element
          ?.querySelector('.product-name a')
          ?.getAttribute('href');
        const imgAlt = element
          ?.querySelector('.product-thumbnail img')
          ?.getAttribute('title');
        const priceElements = element.querySelectorAll(
          '.first-prices .currency2',
        );
        const prices = Array.from(priceElements).map(
          (span) => span.textContent,
        );

        // Remover los caracteres de nueva línea
        let strSinNuevaLinea = prices[0].replace(/\n/g, '').trim();
        let index = strSinNuevaLinea.indexOf('(');

        // Extraer las partes del string
        let priceDolar = strSinNuevaLinea.substring(0, index).trim();
        let priceSoles = strSinNuevaLinea
          .substring(index + 1, strSinNuevaLinea.length - 1)
          .trim();

        return {
          imgSrc,
          dataOriginal,
          imgAlt,
          priceDolar,
          priceSoles,
          url,
        };
      });
    });

    return cardInfo;
  }

  async scrapCyC(store: Store): Promise<void> {
    const { page, browser } = await this.configScraping(
      'https://cyccomputer.pe/250-pc-componente?page=31',
    );
    const nextPageSelector = '.page-list a.next.js-search-link';
    let hasNextPage = true;
    await this.props.mongoClient.connect();
    while (hasNextPage) {
      const cardInfo = await this.scrapyCardCyC(page);
      await this.saveData(cardInfo, store);
      const nextPageElement = await page.$(nextPageSelector);
      if (nextPageElement) {
        await nextPageElement.click();
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
      } else {
        hasNextPage = false;
      }
    }
    this.props.mongoClient.close();
    await browser.close();
  }

  async scrapImpacto(store: Store): Promise<void> {
    const { page, browser } = await this.configScraping(
      'https://www.impacto.com.pe/catalogo?menu=Componentes',
    );

    const pageNumber =
      (await page.$$eval(
        '.pagination li.page-item:nth-last-child(2) a.page-link',
        (elements) => {
          const lastPageLink = elements[0];
          if (!lastPageLink.textContent) return;
          return parseInt(lastPageLink.textContent);
        },
      )) || 0;

    await this.props.mongoClient.connect();

    for (let i = 29; i <= pageNumber; i++) {
      await page.goto(
        `https://www.impacto.com.pe/catalogo?menu=Componentes?page=${i}`,
      ); //https://www.impacto.com.pe/catalogo?menu=Componentes?page=76
      const cardInfo = await this.scrapyCardImpacto(page);
      await this.saveData(cardInfo, store);
    }
    this.props.mongoClient.close();
    await browser.close();
  }

  async scrapSercoPlus(store: Store): Promise<void> {
    const { page, browser } = await this.configScraping(
      'https://www.sercoplus.com/731-arma-tu-pc',
    );

    const pageNumber =
      (await page.$$eval(
        '.page-list li:nth-last-child(2) a.js-search-link',
        (elements) => {
          const lastPageLink = elements[0];
          if (!lastPageLink.textContent) return;
          return parseInt(lastPageLink.textContent);
        },
      )) || 0;

    await this.props.mongoClient.connect();

    for (let i = 64; i <= pageNumber; i++) {
      await page.goto(`https://www.sercoplus.com/731-arma-tu-pc?page=${i}`); //https://www.sercoplus.com/731-arma-tu-pc?page=48
      const cardInfo = await this.scrapyCardSercoPlus(page);
      await this.saveData(cardInfo, store);
    }
    this.props.mongoClient.close();
    await browser.close();
  }
}
