import { Category } from '../domain/Category';

export interface CategoryRepositoryI {
  findAll(): Promise<Category[]>;
}
