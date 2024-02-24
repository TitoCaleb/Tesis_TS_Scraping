import { Store } from '../domain/Store';

export interface StoresServiceI {
  findAll(): Promise<Store[]>;
}
