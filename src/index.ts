import { Ethereum } from 'kelvinjs-eth';

import { ICurrencyUtil } from './api';

const ethCurUtil = new Ethereum();

export const SUPPORTED_CURRENCY_NAMES = ['eth'];

export const getCurrency = (name: string): ICurrencyUtil => {
  if (!SUPPORTED_CURRENCY_NAMES.includes(name)) {
    throw Error(`unknown currency name ${name}`);
  }

  switch (name) {
    case 'eth':
      return ethCurUtil;
    default:
      throw Error('control reaches a point which shall be unreachable');
  }
};
