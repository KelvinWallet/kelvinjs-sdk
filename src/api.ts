/**
 * Represent a USB command to KelvinWallet.
 */
export interface IArmadilloCommand {
  commandId: number;
  payload: Buffer;
}

/**
 * Represent a USB response from KelvinWallet.
 */
export interface IArmadilloResponse {
  payload: Buffer;
}

/**
 * Represent a transaction signing request.
 *
 * @param network - the network to use
 * @param accountIndex - the index of an account (should be 0, 1, 2, 3, ...)
 * @param fromPubkey - the 65-byte hex string of the secp256k1 public key
 * @param toAddr - the address to which we send the money
 * @param amount - the amount of money to send in normal unit (no wei/satoshi)
 * @param feeOpt - the selected fee option (if the currency requires tx fee)
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
 * Represent the printable information about a transaction.
 */
export interface ITransaction {
  [key: string]: {
    value: string;
    link?: string;
  };
}

/**
 * Represent the format of a single field of a printable transaction:
 *
 *      1. How to look up the field in an object of type ITransaction
 *      2. The name of the field
 *      3. The format of the field when rendering
 *
 * We use an array of ITransactionSchema to describe how to render a
 * transaction.
 *
 * @param key - the key to look up an object of type ITransaction
 * @param label - table first row, human readable string
 * @param format - the type of the data
 *
 * The implementation may provide a column whose key and label are both
 * `"isConfirmed"`, and whose value must be either `"true"` or `"false"`.
 * When such column exists, it SHALL be the last one in the array.  Such
 * column will be used by UI component when rendering.
 *
 * Date strings should conform to ISO 8601 standard and use UTC timezone.
 *
 * In fact, we should probably refactor and rename this interface.
 *
 * We should not call this ITransactionSchema:
 *
 *      { key: string; label: string; format: string; }
 *
 * We should instead call this ITransactionSchema:
 *
 *      Array<{ key: string; label: string; format: string; }>
 *
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
 * Lower-level cryptocurrency module.
 */
export interface ICurrencyUtil {
  /**
   * Declare the list of supported network strings.
   *
   * Most of the functions in this interface require a `network` argument.
   *
   * The implementation MUST implement at least one network "mainnet".
   * Testnets are optional, but we SHOULD implement at least one testnet too.
   *
   * For BTC/LTC/BCH/XRP/TRX, network should be either "mainnet" or "testnet".
   * For ETH, network should be "mainnet", "kovan", "ropsten", or "rinkeby".
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
   * - BTC: user can choose fee option with unit "sat/kB"
   * - LTC: user can choose fee option with unit "sat/kB"
   * - BCH: user can choose fee option with unit "sat/kB"
   * - ETH: user can choose fee option with unit "Gwei"
   * - TRX: no need to specify tx fee (so this function throws an Error)
   * - XRP: no need to specify tx fee (so this function throws an Error)
   *
   * @returns the display unit for fee (like "sat/kB" or "Gwei")
   * @throws Error if we do not require tx fee for this currency
   */
  getFeeOptionUnit(): string;

  /**
   * If this currency does not require user to choose a fee option, then this
   * function throws an Error.
   *
   * If this currency requires user to choose a fee option for a transaction,
   * then this function checks if the provided string is a valid fee option in
   * the implementation-defined unit as indicated by `getFeeOptionUnit()`.
   * The implementation may choose to apply some sanity range checks.
   *
   * This is intended to be used to verify untrusted input from the user.
   *
   * @param network - the network to use
   * @param feeOpt - the string to check
   *
   * @returns whether the provided string is a valid fee option (impl defined)
   * @throws Error if `network` is invalid or if we do not require tx fee
   */
  isValidFeeOption(network: string, feeOpt: string): boolean;

  /**
   * Check if a string is a valid address for the network.
   *
   * This is intended to be used to verify untrusted input from the user.
   *
   * @param network - the network to use
   * @param addr - the string to check
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
   * @param amount - the string to check
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
   * @throws Error if `amount` is invalid (not passing `isValidNormAmount()`)
   *
   * DISCUSSION:
   * Because functions like `prepareCommandSignTx()` accept amount argument
   * with value in normal unit, rather than base unit, this function seems
   * useless.
   */
  convertNormAmountToBaseAmount(amount: string): string;

  /**
   * Convert value from base unit to normal unit.
   *
   * @param amount - the string representation of the value in base unit
   *
   * @returns the string representation of the value in normal unit
   * @throws Error if `amount` is invalid (not passing _isValidBaseAmount_)
   *
   * DISCUSSION:
   * Because functions like `getBalance()` returns amount with value in normal
   * unit, rather than base unit, this function seems useless.
   */
  convertBaseAmountToNormAmount(amount: string): string;

  /**
   * Generate an URL To view the information about an account using some
   * blockchain explorer.
   *
   * @param network - the network to use
   * @param addr - the address to look up
   *
   * @throws Error if any argument is invalid
   */
  getUrlForAddr(network: string, addr: string): string;

  /**
   * Generate an URL To view the information about an account using some
   * blockchain explorer.
   *
   * @param network - the network to use
   * @param txid - the transaction to look up
   *
   * @throws Error if any argument is invalid
   *
   * DISCUSSION:
   * The only case where we might need this is to build history view, but that
   * is already covered by the return value of `getRecentHistory()`.  Thus
   * this function seems useless.  However, because this function is so
   * simple, we can still implement it.
   */
  getUrlForTx(network: string, txid: string): string;

  /**
   * Encode public key as an address
   *
   * @param network - the network to use
   * @param pubkey - the 65-byte hex string of the secp256k1 public key
   *
   * @returns the address derived from the specified public key
   * @throws Error if any argument is invalid
   *
   * The pubkey must pass the (s => /^04[0-9a-f]{128}$/.test(s)) check.
   */
  encodePubkeyToAddr(network: string, pubkey: string): string;

  /**
   * Async return the balance in normal unit, in string representation
   *
   * It is suggested that the calculate should only considers "confirmed"
   * transactions.  But the actual behavior of this function is implementation
   * defined.  Implementers should write document about their final choices.
   *
   * @param network - the network to use
   * @param addr - the address to look up
   *
   * @returns the string representation of the balance in the normal unit
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
   * transactions.  API user should call `getHistorySchema()` to understand
   * how to render the information.
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
   * currency needs to choose a fee option.  The results is an array of one or
   * more options, in the unit specified by `getFeeOptionUnit()`.
   *
   * If this currency does not require user to choose a fee option, then this
   * function returns a Promise that always rejects.
   *
   * @param network - the network to use
   *
   * @returns a list of one or more fee options
   * @throws Error if any argument is invalid, or if network error
   */
  getFeeOptions(network: string): Promise<string[]>;

  /**
   * Get the schema information about how to render the ITransaction object
   * returned from `prepareCommandSignTx()`.  The UI component can generate a
   * view for user to compare and verify the TX information on cold wallet.
   *
   * @returns an array of ITransactionSchema, each encodes a field for the tx
   */
  getPreparedTxSchema(): ITransactionSchema[];

  /**
   * Async return full information for an unsigned transaction.
   *
   * @param req - the full info
   *
   * @returns a pair of the signing command and printable info for this tx
   * @throws Error if any argument is invalid, or if network error, or if the
   * request cannot be fulfilled.
   *
   */
  prepareCommandSignTx(
    req: ISignTxRequest
  ): Promise<[IArmadilloCommand, ITransaction]>;

  /**
   * Build signed transaction that can be broadcasted.  The result string is
   * in an implementation-defined format suitable for `submitTransaction()`.
   *
   * @param req - the original request passed to `prepareCommandSignTx()`
   * @param preparedTx - the command to KelvinWallet
   * @param walletRsp - the response from KelvinWallet
   *
   * @returns the serialized signed transaction
   * @throws Error if any argument is invalid
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
   * @param signedTx - serialized signed transaction from `buildSignedTx()`
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
   *
   * @returns the public export command
   */
  prepareCommandGetPubkey(
    network: string,
    accountIndex: number
  ): IArmadilloCommand;

  /**
   * Extract the public key from a response generated by KelvinWallet to the
   * command generated by `prepareCommandGetPubkey()`.
   *
   * @param walletRsp - the response from KelvinWallet
   *
   * @returns the 65-byte hex string of the secp256k1 public key
   */
  parsePubkeyResponse(walletRsp: IArmadilloResponse): string;

  /**
   * Return the encoded command to send to KelvinWallet, to show an address
   *
   * @param network - the network to use
   * @param accountIndex - the index of an account (should be 0, 1, 2, 3, ...)
   *
   * @returns the show address command
   */
  prepareCommandShowAddr(
    network: string,
    accountIndex: number
  ): IArmadilloCommand;

  /**
   * Allow more implementation-defined properties to be attached.
   */
  [k: string]: any;
}
