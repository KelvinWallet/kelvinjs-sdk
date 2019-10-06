/**
 * This interface describes a column of an account history view.
 *
 * @property key: property/index to look up an IHistoryTransaction object
 * @property label: table first row, human readable string
 * @property format: date is format with iso string
 *
 * The implementation may provide a column whose key and label are both
 * `"isConfirmed"`, and value must be either `"true"` or `"false"`.  When such
 * column exists, it SHALL be the last one in the array.
 *
 * Date strings should conform to be ISO 8601 string and use UTC.
 */
export interface ITransactionSchema {
  key: string;
  label: string;
  format:
    | 'address'
    | 'boolean'
    | 'date'
    | 'hash'
    | 'number'
    | 'string'
    | 'value';
}

/**
 * This interface describes a row of an account history view.
 */
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

/**
 *
 * @param network - the network to use
 * @param fromPubkey - the standard 65-byte hex string representation of the
 * secp256k1 public key
 * @param fromAddr - the address to send money from
 * @param toAddr - the address to send money to
 * @param amount - the amount of money to send (in the base unit)
 * @param feeOpt - the fee option user selected
 */
export interface ISignTxRequest {
  network: string;
  accountIndex: number;
  fromPubkey: string;
  toAddr: string;
  amount: string;
  feeOpt?: string;
}

/**
 * This interface defines what a lower-level cryptocurrency module should
 * provide.
 *
 * Opt for simplicity at first.  Try to keep things dead simple.
 *
 * We can just use strings to represent many different kinds of information,
 * because most of the information we want to process is serializable.
 * Instead of complicated generic interface, we can simply use strings and get
 * the job done.
 *
 * We can review and refactor the interface and actual implementations in the
 * future any way.
 */
export interface ICurrencyUtil {
  /**
   * Declare the list of supported network strings.
   *
   * Most of the functions in this interface require a `network` argument.
   *
   * The implementation MUST implement the case for network to be "mainnet".
   * Testnets are optional, but we should implement at least one testnet.
   *
   * For BTC/LTC/BCH/XRP/TRX, network must be either "mainnet" or "testnet".
   * For ETH, network must be "mainnet", "kovan", "ropsten", or "rinkeby".
   *
   * @returns an array of strings, each represents a network choice.
   *
   */
  getSupportedNetworks(): string[];

  /**
   * Determine what to show as unit for transaction fee in UI.
   *
   * We may choose to have implementations that do these:
   *
   * - TRX: no fee option is available (so this function throws Error)
   * - XRP: no fee option is available (so this function throws Error)
   * - ETH: user can choose fee option with unit "Gwei"
   * - BTC: user can choose fee option with unit "sat/kB"
   * - LTC: user can choose fee option with unit "sat/kB"
   * - BCH: user can choose fee option with unit "sat/kB"
   *
   * @returns a string that is the display UI
   * @throws Error if this currency does not have the concept of tx fee and
   * therefore we don't need to display any in the UI
   */
  getFeeOptionUnit(): string;

  /**
   * If this currency does not require user to choose a fee option, then this
   * function is a dummy function that always return true.  If this currency
   * requires user to choose a fee option for a transaction, then this
   * function checks if the provided string is a valid fee option in an
   * implementation-defined unit as indicated by `getFeeOptionUnit()`.
   *
   * This is intended to be used to verify untrusted input from the user.
   *
   * @param network - the network to use
   * @param feeOpt - the string that we are not sure if it is in valid format
   *
   * @returns whether the provided string is a valid fee option (impl defined)
   * @throws Error if `network` is invalid
   */
  isValidFeeOption(network: string, feeOpt: string): boolean;

  /**
   * Check if a string is a valid address for the network.
   *
   * This is intended to be used to verify untrusted input from the user.
   *
   * @param network - the network to use
   * @param addr - the string that we are not sure if it is in valid format
   *
   * @returns whether the provided string is a valid address
   * @throws Error if `network` is invalid
   */
  isValidAddr(network: string, addr: string): boolean;

  /**
   * Check if a string is a valid amount (normal unit) to pay for the network.
   *
   * This is intended to be used to verify untrusted input from the user.
   *
   * @param network - the network to use
   * @param amount - the string that we are not sure if it is in valid format
   *
   * @returns whether the provided string is a valid amount in normal unit
   * @throws Error if `network` is invalid
   */
  isValidNormAmount(amount: string): boolean;

  /**
   * Convert value from normal unit to base unit.
   *
   * @param amount - the string representation of the value in normal unit
   *
   * @returns the string representation of the value in base unit
   * @throws Error if `amount` is invalid (shall pass isValidNormAmount)
   *
   * DISCUSSION:
   * When would we want to use this function?  Is this function only for the
   * `amount` argument for prepareTx()?  If that is the case, maybe we can
   * simply do this automatically in the `prepareTx()` function altogether,
   * and deprecate this function?
   */
  convertNormAmountToBaseAmount(amount: string): string;

  /**
   * Convert value from base unit to normal unit.
   *
   * @param amount - the string representation of the value in base unit
   *
   * @returns the string representation of the value in normal unit
   * @throws Error if `amount` is invalid (shall pass _isValidBaseAmount)
   *
   * DISCUSSION:
   * Maybe we can remove this function, because it seems there is no need.  If
   * this is only used by getBalance() maybe we can do this there?
   */
  convertBaseAmountToNormAmount(amount: string): string;

  /**
   * Generate an URL To view the information about an account using some
   * blockchain explorer.
   *
   * @param network - the network to use
   * @param addr - the address to look up
   * @throws Error if any argument is invalid
   */
  getUrlForAddr(network: string, addr: string): string;

  /**
   * Generate an URL To view the information about an account using some
   * blockchain explorer.
   *
   * @param network - the network to use
   * @param txid - the transaction to look up
   * @throws Error if any argument is invalid
   *
   * DISCUSSION:
   * The only case where we might need this is to build history view, but that
   * is already covered by `getRecentHistory()`.  Therefore it seems we can
   * remove this function.  However, because this function is so simple, we
   * can still implement it.
   */
  getUrlForTx(network: string, txid: string): string;

  /**
   * Encode public key as an address
   *
   * @param network - the network to use
   * @param pubkey - the standard 65-byte hex string representation of the
   * secp256k1 public key
   *
   * @returns the address derived from the specified public key
   * @throws Error if any argument is invalid
   *
   * The pubkey must pass the (s => /^04[0-9a-f]{128}$/.test(s)) check.
   */
  encodePubkeyToAddr(network: string, pubkey: string): string;

  /**
   * Async return the balance in base unit, in string representation
   *
   * It is suggested that the calculate should only considers "confirmed"
   * transactions.  But the actual behavior of this function is implementation
   * defined.  Implementers should write document about their final choices.
   *
   * API user can call convertBaseAmountToNormAmount() for human-readable
   * format.
   *
   * @param network - the network to use
   * @param addr - the address to look up
   *
   * @returns the string representation of the balance in the base unit
   * @throws Error if any argument is invalid, or if network error
   */
  getBalance(network: string, addr: string): Promise<string>;

  /**
   * Return a list of column specifiers.
   *
   * @returns an array of objects, each specifies a column in the history view
   */
  getHistorySchema(): ITransactionSchema[];

  /**
   * Async return a list of rows representing recent history INCLUDING pending
   * transactions.  API user can call getHistorySchema() to understand the
   * actual schema.
   *
   * QUESTION:
   * How to let the UI know a transaction is not confirmed yet?
   *
   * Ad-hoc design: in order to indicate whether a transaction is confirmed or
   * not, we can have a column:
   *
   *      {
   *        "key": "isConfirmed",
   *        "label": "isConfirmed",
   *        "format": "number"
   *      }
   *
   * whose actual value must be representing by "0" or "1".
   *
   * Better design: We can design the interface to explicitly allow an
   * optional boolean field just for this purpose.
   *
   * @param network - the network to use
   * @param addr - the address to look up
   *
   * @returns an array of objects, each specifies a row in the history view
   * @throws Error if any argument is invalid
   */
  getRecentHistory(network: string, addr: string): Promise<ITransaction[]>;

  /**
   * Query the current suggested fee options from 3rd-party API, if this
   * currency needs to choose a fee option.
   *
   * If this currency does not require user to choose a fee option, then this
   * is a dummy implementation that resolve to an empty array immediately.
   *
   * This is intended to be used to verify untrusted input from the user.
   *
   * @param network - the network to use
   *
   * @returns a list of one or more fee options; each option is just a string
   * representation of some value in the unit `getFeeOptionUnit()`
   * @throws Error if any argument is invalid, or if network error
   */
  getFeeOptions(network: string): Promise<string[]>;

  /**
   * Return a schema that describe the ITransaction objects returned from
   * prepareCommandSignTx()
   */
  getPreparedTxSchema(): ITransactionSchema[];

  /**
   * Async return full information for an unsigned transaction.
   *
   * @param req - the full info
   * @returns a tuple of the encoded command to send to KelvinWallet and the
   * transaction information to show to user
   * @throws Error if any argument is invalid, or if network error, or if the
   * request (fromAddr, toAddr, amount, feeOpt) cannot be fulfilled.
   *
   */
  prepareCommandSignTx(
    req: ISignTxRequest
  ): Promise<[IArmadilloCommand, ITransaction]>;

  /**
   * Return (serialized) signed transaction
   *
   * @param preparedTx - the transaction signing context
   * @param walletRsp - the response from KelvinWallet
   *
   * @returns the serialized signed transaction, which can be passed into
   * submitTransaction()
   * @throws Error if any argument is invalid
   *
   * For some currency, the protobuf response is only a fixed length ECDSA
   * signature.  We need to build the complete signed transaction that can be
   * broadcasted.  For BTC, do nothing.  For ETH, recover with pubkey...
   *
   * Return value can be in implementation-defined format (not necessarily hex
   * string).
   */
  buildSignedTx(
    req: ISignTxRequest,
    preparedTx: IArmadilloCommand,
    walletRsp: IArmadilloResponse
  ): string;

  /**
   * Submit a signed transaction to the blockchain
   *
   * @param network - the network to use
   * @param signedTx - serialized signed transaction from buildSignedTx
   *
   * @returns the txid of the transaction you just submitted
   * @throws Error if any argument is invalid, or if network error
   */
  submitTransaction(network: string, signedTx: string): Promise<string>;

  /**
   * Return the encoded command to send to KelvinWallet, to query a public key
   *
   * @param network - the network to use
   * @param accountIndex - the index of an account (should be 0, 1, 2, 3, ...)
   */
  prepareCommandGetPubkey(
    network: string,
    accountIndex: number
  ): IArmadilloCommand;

  /**
   * Return a hex string representation of a 65-byte pubkey, extracted from
   * the response to the command generated by `prepareCommandGetPubkey()`.
   */
  parsePubkeyResponse(walletRsp: IArmadilloResponse): string;

  /**
   * Return the encoded command to send to KelvinWallet, to show an address
   */
  prepareCommandShowAddr(
    network: string,
    accountIndex: number
  ): IArmadilloCommand;

  /**
   * Allow more properties to be attached to the object.
   */
  [k: string]: any;
}
