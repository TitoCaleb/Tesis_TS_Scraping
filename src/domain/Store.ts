import { ObjectId } from 'mongodb';

export class Store {
  id?: string | ObjectId;

  name: string;

  constructor(data?: Partial<Store>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
