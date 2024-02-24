import { Store } from '../domain/Store';
import { StoresRepositoryI } from '../repository/StoresRepositoryI';
import { StoresServiceI } from './StoresServiceI';

interface StoresServiceImplProps {
  storesRepository: StoresRepositoryI;
}

export class StoresServiceImpl implements StoresServiceI {
  constructor(private props: StoresServiceImplProps) {}

  findAll(): Promise<Store[]> {
    const response = this.props.storesRepository.findAll();
    return response;
  }
}
