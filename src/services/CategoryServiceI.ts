import { Category } from '../domain/Category';

export interface CategoryServiceI {
  findAll(): Promise<Category[]>;
}
