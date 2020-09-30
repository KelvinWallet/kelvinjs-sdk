import { EthSignHash } from 'kelvinjs-eth';

import { KelvinWallet } from 'kelvinjs-usbhid';
import { IArmadilloCommand, IArmadilloResponse } from './api';

import { Command, flags } from '@oclif/command';

const ethSignHashUtil = new EthSignHash();

async function send(command: IArmadilloCommand): Promise<IArmadilloResponse> {
  const device = new KelvinWallet();
  const [status, buffer] = device.send(command.commandId, command.payload);
  device.close();
  if (status !== 0) {
    throw Error(`error status code ${status}`);
  }
  return { payload: buffer };
}

async function doSignHash(index: number, hashHex: string): Promise<void> {
  const command = ethSignHashUtil.buildSignHashCommand(index, hashHex);
  console.log(`Asking KelvinWallet to derive private key for path m/44'/60'/0'/0/${index} and sign the 32-byte digest:`);
  console.log('    ' + hashHex.toUpperCase());
  const response = await send(command);
  const signature = ethSignHashUtil.parseSignHashResponse(response);
  console.log('KelvinWallet returned 64-byte secp256k1 ECDSA signature:');
  console.log('    ' + signature.toUpperCase());
}

class SampleCli extends Command {
  static description = 'Interact with KelvinWallet';

  static args = [
    {
      name: 'hashHex',
      required: true,
    },
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    version: flags.version({ char: 'v' }),
    index: flags.integer({
      char: 'i',
      default: 0,
      description: "specify x in path m/44'/60'/0'/0/x",
    }),
  };

  async run() {
    const { args, flags } = this.parse(SampleCli);
    const index = flags.index;
    const hashHex = args.hashHex;
    doSignHash(index, hashHex);
  }
}

export = SampleCli;
