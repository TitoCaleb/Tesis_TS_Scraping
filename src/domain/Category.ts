import { ObjectId } from 'mongodb';

export class Category {
  id?: string | ObjectId;

  name: string;

  constructor(data?: Partial<Category>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
