"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kelvinjs_eth_1 = require("kelvinjs-eth");
const kelvinjs_btc_1 = require("kelvinjs-btc");
const kelvinjs_ltc_1 = require("kelvinjs-ltc");
const kelvinjs_bch_1 = require("kelvinjs-bch");
const kelvinjs_xrp_1 = require("kelvinjs-xrp");
const kelvinjs_trx_1 = require("kelvinjs-trx");
const ethCurrencyUtil = new kelvinjs_eth_1.Ethereum();
const erc20CurrencyUtil = new kelvinjs_eth_1.ERC20();
const btcCurrencyUtil = new kelvinjs_btc_1.default();
const xrpCurrencyUtil = new kelvinjs_xrp_1.default();
exports.SUPPORTED_CURRENCY_NAMES = [
    'eth',
    'erc20',
    'btc',
    'ltc',
    'bch',
    'xrp',
    'trx',
];
exports.getCurrency = (name) => {
    if (!exports.SUPPORTED_CURRENCY_NAMES.includes(name)) {
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
            return kelvinjs_ltc_1.ltcCurrencyUtil;
        case 'bch':
            return kelvinjs_bch_1.bchCurrencyUtil;
        case 'xrp':
            return xrpCurrencyUtil;
        case 'trx':
            return kelvinjs_trx_1.trxCurrencyUtil;
        default:
            throw Error('control reaches a point which shall be unreachable');
    }
};
