import e = require('express');
import { Store } from '../domain/Store';
import { urlsCyC, urlsImpacto, urlsSercolus } from './urls';

export enum StoreNames {
  IMPACTO = 'Impacto',
  SERCOPLUS = 'Sercoplus',
  CYC = 'C&C Computer',
}

export const storeList: Store[] = [
  {
    name: StoreNames.IMPACTO,
    urls: urlsImpacto,
  },
  {
    name: StoreNames.SERCOPLUS,
    urls: urlsSercolus,
  },
  {
    name: StoreNames.CYC,
    urls: urlsCyC,
  },
];
