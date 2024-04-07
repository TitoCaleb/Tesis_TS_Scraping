import { PuppeteerNode, type Page } from 'puppeteer';
import { ScrapingRepositoryI } from './ScrapingRepositoryI';
import { Store, UrlStore } from '../domain/Store';
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

  private async saveData(cardInfo: any[], store: Store, name: string) {
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
            tienda: {
              id: store.id,
              name: store.name,
            },
            categoria: name,
          }),
      );

      await productsCollection.insertMany(products);
      return products;
    } catch (error) {
      throw new Error(error);
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

        // Eliminar saltos de línea
        const precios = prices[0]
          .replace(/\n/g, '')
          .replace('(', '')
          .replace(')', '')
          .split('  ');

        return {
          imgSrc,
          dataOriginal: null,
          imgAlt,
          priceDolar: precios[0].split(' ')[0],
          priceSoles: precios[0].split(' ')[1],
          url,
        };
      });
    });

    return cardInfo;
  }

  async scrapCyC(store: Store, { url, name }: UrlStore): Promise<void> {
    const { page, browser } = await this.configScraping(url);
    const nextPageSelector = '.page-list a.next.js-search-link';
    let hasNextPage = true;
    await this.props.mongoClient.connect();
    while (hasNextPage) {
      const cardInfo = await this.scrapyCardCyC(page);
      await this.saveData(cardInfo, store, name);
      const nextPageElement = await page.$(nextPageSelector);
      if (nextPageElement) {
        await nextPageElement.click();
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
      } else {
        hasNextPage = false;
      }
    }
    await browser.close();
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

  async scrapImpacto(store: Store, { url, name }: UrlStore): Promise<void> {
    const { page, browser } = await this.configScraping(url);

    const pageList = await page.$$('.pagination li');

    const penultimateHTML = pageList[pageList.length - 2];

    const pageNumber =
      (await page.evaluate((element) => element.outerHTML, penultimateHTML)) ||
      undefined;

    await this.props.mongoClient.connect();

    if (pageNumber) {
      for (let i = 1; i <= Number(pageNumber); i++) {
        await page.goto(`${url}?page=${i}`);
        const cardInfo = await this.scrapyCardImpacto(page);
        await this.saveData(cardInfo, store, name);
      }
    }
    this.props.mongoClient.close();
    await browser.close();
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

        let strSinNuevaLinea = prices[0].replace(/\n/g, '').trim();
        let index = strSinNuevaLinea.indexOf('(');

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

  async scrapSercoPlus(store: Store, { url, name }: UrlStore): Promise<void> {
    const { page, browser } = await this.configScraping(url);
    const pageNumber =
      (await page.$$eval(
        '.page-list li:nth-last-child(2) a.js-search-link',
        (elements) => {
          const lastPageLink = elements[0];
          console.log(lastPageLink);
          if (!lastPageLink.textContent) return;
          return parseInt(lastPageLink.textContent);
        },
      )) || 0;

    await this.props.mongoClient.connect();

    for (let i = 1; i <= pageNumber; i++) {
      await page.goto(`${url}?page=${i}`);
      const cardInfo = await this.scrapyCardSercoPlus(page);
      await this.saveData(cardInfo, store, name);
    }
    this.props.mongoClient.close();
    await browser.close();
  }
}
