import { Store } from '../domain/Store';

export interface StoresRepositoryI {
  findAll(): Promise<Store[]>;
}
