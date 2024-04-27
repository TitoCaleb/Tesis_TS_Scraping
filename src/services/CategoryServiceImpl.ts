import { Category } from '../domain/Category';
import { CategoryRepositoryI } from '../repository/CategoryRepositoryI';
import { CategoryServiceI } from './CategoryServiceI';

interface CategoryRepositoryProps {
  categoryRepository: CategoryRepositoryI;
}

export class CategoryServiceImpl implements CategoryServiceI {
  constructor(private props: CategoryRepositoryProps) {}

  findAll(): Promise<Category[]> {
    try {
      const response = this.props.categoryRepository.findAll();
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}
