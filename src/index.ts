import { ICurrencyUtil } from './api';

import { Ethereum, ERC20 } from 'kelvinjs-eth';
import Bitcoin from 'kelvinjs-btc';
import { ltcCurrencyUtil } from 'kelvinjs-ltc';
import { bchCurrencyUtil } from 'kelvinjs-bch';
import Ripple from 'kelvinjs-xrp';
import { trxCurrencyUtil } from 'kelvinjs-trx';

const ethCurrencyUtil = new Ethereum();
const erc20CurrencyUtil = new ERC20();
const btcCurrencyUtil = new Bitcoin();
const xrpCurrencyUtil = new Ripple();

export const SUPPORTED_CURRENCY_NAMES = [
  'eth',
  'erc20',
  'btc',
  'ltc',
  'bch',
  'xrp',
  'trx',
];

export const getCurrency = (name: string): ICurrencyUtil => {
  if (!SUPPORTED_CURRENCY_NAMES.includes(name)) {
    throw Error(`unknown currency name ${name}`);
  }
  switch (name) {
    case 'eth':
      return ethCurrencyUtil;
    case 'erc20':
      return erc20CurrencyUtil;
    case 'btc':
      return btcCurrencyUtil;
    case 'ltc':
      return ltcCurrencyUtil;
    case 'bch':
      return bchCurrencyUtil;
    case 'xrp':
      return xrpCurrencyUtil;
    case 'trx':
      return trxCurrencyUtil;
    default:
      throw Error('control reaches a point which shall be unreachable');
  }
};
