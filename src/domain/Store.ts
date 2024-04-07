import { ObjectId } from 'mongodb';
import { CategoryNames } from '../database/categories';

export type UrlStore = {
  url: string;
  name: CategoryNames;
};

export class Store {
  id?: string | ObjectId;

  name: string;

  urls?: UrlStore[];

  constructor(data?: Partial<Store>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
