"use strict";
const kelvinjs_eth_1 = require("kelvinjs-eth");
const kelvinjs_usbhid_1 = require("kelvinjs-usbhid");
const command_1 = require("@oclif/command");
const ethSignHashUtil = new kelvinjs_eth_1.EthSignHash();
async function send(command) {
    const device = new kelvinjs_usbhid_1.KelvinWallet();
    const [status, buffer] = device.send(command.commandId, command.payload);
    device.close();
    if (status !== 0) {
        throw Error(`error status code ${status}`);
    }
    return { payload: buffer };
}
async function doSignHash(index, hashHex) {
    const command = ethSignHashUtil.buildSignHashCommand(index, hashHex);
    console.log(`Asking KelvinWallet to derive private key for path m/44'/60'/0'/0/${index} and sign the 32-byte digest:`);
    console.log('    ' + hashHex.toUpperCase());
    const response = await send(command);
    const signature = ethSignHashUtil.parseSignHashResponse(response);
    console.log('KelvinWallet returned 64-byte secp256k1 ECDSA signature:');
    console.log('    ' + signature.toUpperCase());
}
class SampleCli extends command_1.Command {
    async run() {
        const { args, flags } = this.parse(SampleCli);
        const index = flags.index;
        const hashHex = args.hashHex;
        doSignHash(index, hashHex);
    }
}
SampleCli.description = 'Interact with KelvinWallet';
SampleCli.args = [
    {
        name: 'hashHex',
        required: true,
    },
];
SampleCli.flags = {
    help: command_1.flags.help({ char: 'h' }),
    version: command_1.flags.version({ char: 'v' }),
    index: command_1.flags.integer({
        char: 'i',
        default: 0,
        description: "specify x in path m/44'/60'/0'/0/x",
    }),
};
module.exports = SampleCli;
