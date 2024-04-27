import { MongoClient } from 'mongodb';
import { ProductsRepositoryImpl } from './ProductsRepositoryImpl';
import { StoresRepositoryImpl } from './StoresRepositoryImpl';
import { ScrapingRepositoryImpl } from './ScrapingRepositoryImpl';
import MONGO_URI from '../database/config';
import puppeteer from 'puppeteer';
import { CategoryRepositoryImpl } from './CategoryRepositoryImpl';

const mongoClient = new MongoClient(MONGO_URI);
const puppeteerClient = puppeteer;

export const productsRepository = new ProductsRepositoryImpl({
  mongoClient,
  colletionName: process.env.COLLECTION_PRODUCTS,
  databaseName: process.env.DB_NAME,
});

export const storesRepository = new StoresRepositoryImpl({
  mongoClient,
  colletionName: process.env.COLLECTION_STORES,
  databaseName: process.env.DB_NAME,
});

export const scrapingRepository = new ScrapingRepositoryImpl({
  mongoClient,
  puppeteerClient,
  colletionName: process.env.COLLECTION_PRODUCTS,
  databaseName: process.env.DB_NAME,
});

export const categoryRepository = new CategoryRepositoryImpl({
  mongoClient,
  colletionName: process.env.COLLECTION_CATEGORY,
  databaseName: process.env.DB_NAME,
});
