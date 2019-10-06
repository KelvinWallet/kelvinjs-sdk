"use strict";
const _1 = require(".");
const kelvinjs_usbhid_1 = require("kelvinjs-usbhid");
const command_1 = require("@oclif/command");
async function send(command) {
    const device = new kelvinjs_usbhid_1.KelvinWallet();
    const [status, buffer] = device.send(command.commandId, command.payload);
    device.close();
    if (status !== 0) {
        throw Error(`error status code ${status}`);
    }
    return { payload: buffer };
}
class SampleCli extends command_1.Command {
    async run() {
        const { args, flags } = this.parse(SampleCli);
        const { currency, network, action } = args;
        const cur = _1.getCurrency(currency);
        if (!cur.getSupportedNetworks().includes(network)) {
            throw Error(`unsupported network ${network}`);
        }
        switch (action) {
            case 'showaddr':
                return showaddr(cur, network, flags.account);
            case 'getpubkey':
                return getpubkey(cur, network, flags.account);
            case 'toaddr':
                return toaddr(cur, network, flags.pubkey);
            case 'fees':
                return fees(cur, network);
            case 'signtx':
                return signtx(cur, network, flags.account, flags.pubkey, flags.to, flags.amount, flags.fee);
            case 'broadcast':
                return broadcast(cur, network, flags.tx);
            default:
                throw Error('control reaches a point which shall be unreachable');
        }
    }
}
SampleCli.description = 'Interact with KelvinWallet';
SampleCli.args = [
    {
        name: 'currency',
        required: true,
        options: _1.SUPPORTED_CURRENCY_NAMES,
    },
    {
        name: 'network',
        required: true,
    },
    {
        name: 'action',
        required: true,
        options: [
            'getpubkey',
            'toaddr',
            'showaddr',
            'fees',
            'signtx',
            'broadcast',
        ],
    },
];
SampleCli.flags = {
    help: command_1.flags.help({ char: 'h' }),
    version: command_1.flags.version({ char: 'v' }),
    account: command_1.flags.integer({ default: 0 }),
    pubkey: command_1.flags.string({ default: '' }),
    to: command_1.flags.string({ default: '' }),
    amount: command_1.flags.string({ default: '' }),
    fee: command_1.flags.string({ default: '' }),
    tx: command_1.flags.string({ default: '' }),
};
async function showaddr(cur, network, account) {
    const command = cur.prepareCommandShowAddr(network, account);
    await send(command);
}
async function getpubkey(cur, network, account) {
    const command = cur.prepareCommandGetPubkey(network, account);
    const response = await send(command);
    const pubkey = cur.parsePubkeyResponse(response);
    console.log(`your pubkey for account ${account} is:`);
    console.log(pubkey);
}
async function toaddr(cur, network, pubkey) {
    const addr = cur.encodePubkeyToAddr(network, pubkey);
    console.log(`the encoded address is:`);
    console.log(addr);
}
async function fees(cur, network) {
    const unit = cur.getFeeOptionUnit();
    const feeOptions = await cur.getFeeOptions(network);
    console.log(`suggested fee options (in the unit of: ${unit})`);
    for (const opt of feeOptions) {
        console.log(opt);
    }
}
async function signtx(cur, network, account, pubkey, to, amount, fee) {
    const req = {
        network,
        accountIndex: account,
        fromPubkey: pubkey,
        toAddr: to,
        amount,
        feeOpt: fee ? fee : undefined,
    };
    const schema = cur.getPreparedTxSchema();
    const [command, metaInfo] = await cur.prepareCommandSignTx(req);
    console.log('----------------');
    for (const item of schema) {
        const label = item.label;
        const content = metaInfo[item.key].value;
        console.log(`${label}\t: ${content}`);
    }
    console.log('----------------');
    const response = await send(command);
    const tx = cur.buildSignedTx(req, command, response);
    console.log(tx);
}
async function broadcast(cur, network, tx) {
    const txid = await cur.submitTransaction(network, tx);
    console.log(txid);
}
module.exports = SampleCli;
