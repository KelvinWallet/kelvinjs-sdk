/// <reference types="node" />
export interface ITransactionSchema {
    key: string;
    label: string;
    format: 'address' | 'boolean' | 'date' | 'hash' | 'number' | 'string' | 'value';
}
export interface ITransaction {
    [key: string]: {
        value: string;
        link?: string;
    };
}
export interface IArmadilloCommand {
    commandId: number;
    payload: Buffer;
}
export interface IArmadilloResponse {
    payload: Buffer;
}
export interface ISignTxRequest {
    network: string;
    accountIndex: number;
    fromPubkey: string;
    toAddr: string;
    amount: string;
    feeOpt?: string;
}
export interface ICurrencyUtil {
    getSupportedNetworks(): string[];
    getFeeOptionUnit(): string;
    isValidFeeOption(network: string, feeOpt: string): boolean;
    isValidAddr(network: string, addr: string): boolean;
    isValidNormAmount(amount: string): boolean;
    convertNormAmountToBaseAmount(amount: string): string;
    convertBaseAmountToNormAmount(amount: string): string;
    getUrlForAddr(network: string, addr: string): string;
    getUrlForTx(network: string, txid: string): string;
    encodePubkeyToAddr(network: string, pubkey: string): string;
    getBalance(network: string, addr: string): Promise<string>;
    getHistorySchema(): ITransactionSchema[];
    getRecentHistory(network: string, addr: string): Promise<ITransaction[]>;
    getFeeOptions(network: string): Promise<string[]>;
    getPreparedTxSchema(): ITransactionSchema[];
    prepareCommandSignTx(req: ISignTxRequest): Promise<[IArmadilloCommand, ITransaction]>;
    buildSignedTx(req: ISignTxRequest, preparedTx: IArmadilloCommand, walletRsp: IArmadilloResponse): string;
    submitTransaction(network: string, signedTx: string): Promise<string>;
    prepareCommandGetPubkey(network: string, accountIndex: number): IArmadilloCommand;
    parsePubkeyResponse(walletRsp: IArmadilloResponse): string;
    prepareCommandShowAddr(network: string, accountIndex: number): IArmadilloCommand;
    [k: string]: any;
}
