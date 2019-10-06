"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kelvinjs_eth_1 = require("kelvinjs-eth");
const ethCurUtil = new kelvinjs_eth_1.Ethereum();
exports.SUPPORTED_CURRENCY_NAMES = ['eth'];
exports.getCurrency = (name) => {
    if (!exports.SUPPORTED_CURRENCY_NAMES.includes(name)) {
        throw Error(`unknown currency name ${name}`);
    }
    switch (name) {
        case 'eth':
            return ethCurUtil;
        default:
            throw Error('control reaches a point which shall be unreachable');
    }
};
