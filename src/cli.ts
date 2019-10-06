import { SUPPORTED_CURRENCY_NAMES, getCurrency } from '.';
import {
  ICurrencyUtil,
  IArmadilloCommand,
  IArmadilloResponse,
  ISignTxRequest,
} from './api';

import { KelvinWallet } from 'kelvinjs-usbhid';

import { Command, flags } from '@oclif/command';

async function send(command: IArmadilloCommand): Promise<IArmadilloResponse> {
  const device = new KelvinWallet();
  const [status, buffer] = device.send(command.commandId, command.payload);
  device.close();
  if (status !== 0) {
    throw Error(`error status code ${status}`);
  }
  return { payload: buffer };
}

class SampleCli extends Command {
  static description = 'Interact with KelvinWallet';

  static args = [
    {
      name: 'currency',
      required: true,
      options: SUPPORTED_CURRENCY_NAMES,
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

  static flags = {
    help: flags.help({ char: 'h' }),
    version: flags.version({ char: 'v' }),
    account: flags.integer({ default: 0 }),
    pubkey: flags.string({ default: '' }),
    to: flags.string({ default: '' }),
    amount: flags.string({ default: '' }),
    fee: flags.string({ default: '' }),
    tx: flags.string({ default: '' }),
  };

  async run() {
    const { args, flags } = this.parse(SampleCli);
    const { currency, network, action } = args;
    const cur = getCurrency(currency);

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
        return signtx(
          cur,
          network,
          flags.account,
          flags.pubkey,
          flags.to,
          flags.amount,
          flags.fee
        );
      case 'broadcast':
        return broadcast(cur, network, flags.tx);
      default:
        throw Error('control reaches a point which shall be unreachable');
    }
  }
}

async function showaddr(
  cur: ICurrencyUtil,
  network: string,
  account: number
): Promise<void> {
  const command = cur.prepareCommandShowAddr(network, account);
  await send(command);
}

async function getpubkey(
  cur: ICurrencyUtil,
  network: string,
  account: number
): Promise<void> {
  const command = cur.prepareCommandGetPubkey(network, account);
  const response = await send(command);
  const pubkey = cur.parsePubkeyResponse(response);
  console.log(`your pubkey for account ${account} is:`);
  console.log(pubkey);
}

async function toaddr(
  cur: ICurrencyUtil,
  network: string,
  pubkey: string
): Promise<void> {
  const addr = cur.encodePubkeyToAddr(network, pubkey);
  console.log(`the encoded address is:`);
  console.log(addr);
}

async function fees(cur: ICurrencyUtil, network: string): Promise<void> {
  const unit = cur.getFeeOptionUnit();
  const feeOptions = await cur.getFeeOptions(network);
  console.log(`suggested fee options (in the unit of: ${unit})`);
  for (const opt of feeOptions) {
    console.log(opt);
  }
}

async function signtx(
  cur: ICurrencyUtil,
  network: string,
  account: number,
  pubkey: string,
  to: string,
  amount: string,
  fee: string
): Promise<void> {
  // FIXME: Currently the eth implementation accept amount in normal unit
  // instead of base unit.  Therefore doing this will generate errors:
  //
  //      amount: cur.convertNormAmountToBaseAmount(amount),
  //
  // TODO: Clarify how prepareCommandSignTx should behave and fix the
  // implementations
  //
  //      Choise 1: All amounts should be represented in base unit
  //      Choise 2: All amounts should be represented in normal unit
  //
  const req: ISignTxRequest = {
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

async function broadcast(
  cur: ICurrencyUtil,
  network: string,
  tx: string
): Promise<void> {
  const txid = await cur.submitTransaction(network, tx);
  console.log(txid);
}

export = SampleCli;
