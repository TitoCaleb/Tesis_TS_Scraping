import { CategoryServiceI } from '../services/CategoryServiceI';

export interface CategoryControllerProps {
  service: CategoryServiceI;
}

export class CategoryController {
  constructor(private props: CategoryControllerProps) {}

  async findAll() {
    const response = await this.props.service.findAll();
    return response;
  }
}
