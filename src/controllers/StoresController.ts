import { StoresServiceI } from '../services/StoresServiceI';

export interface StoresControllerProps {
  service: StoresServiceI;
}

export class StoresController {
  constructor(private props: StoresControllerProps) {}

  async findAll() {
    const response = await this.props.service.findAll();
    return response;
  }
}
