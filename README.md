# kelvinjs-sdk

Use Node.js to interact with KelvinWallet.

## Prerequisite

- Node.js v10
- Yarn

## Install the Sample CLI

1.  Clone this repo and switch working directory to the root of this repo

2.  Install all dependencies of this package
    ```
    yarn
    ```

3.  Symlink the executable `kelvin` into a directory in PATH managed by yarn
    ```
    yarn link
    ```

4.  Check if `kelvin` is successfully installed
    ```
    kelvin --version
    ```

## If You Modify the Source Code

1.  Lint the TypeScript project
    ```
    yarn lint
    ```

2.  Compile the TypeScript project
    ```
    yarn build
    ```

## Sample CLI Overview

```
kelvin CURRENCY NETWORK ACTION [OPTIONS ...]

CURRENCY is one of:
    eth

NETWORK (when CURRENCY is eth) is one of:
    mainnet
    ropsten
    kovan
    rinkeby

ACTION is one of:
    showaddr
    getpubkey
    toaddr
    fees
    signtx
    broadcast

Available OPTIONS include:
    --account=account     required when ACTION is getpubkey/showaddr/signtx
    --pubkey=pubkey       required when ACTION is toaddr/signtx
    --amount=amount       required when ACTION is signtx
    --fee=fee             required when ACTION is signtx
    --to=to               required when ACTION is signtx
    --tx=tx               required when ACTION is broadcast
```

## Sample CLI Usage

You need to connect (via a USB cable) and unlock your KelvinWallet before
running commands with ACTION being `showaddr`, `getpubkey`, or `signtx`
described below.

### getpubkey

The resulting public key (in hex) will be printed to stdout.

```
kelvin eth kovan getpubkey
kelvin eth kovan getpubkey --account 0
kelvin eth kovan getpubkey --account 1
kelvin eth kovan getpubkey --account 2
```

### toaddr

The resulting address will be printed to stdout.

```
kelvin eth kovan toaddr --pubkey 04537e0634322c9867100989c89ccdeac1ca69cf64073a296255b6d5ac65984eeb9e449270e250ef1dc25c44f5d8b8be3dd8417cdb5995444cc39a333d65e98dd9
```

### showaddr

The address will be printed on the OLED display of KelvinWallet.

On KelvinWallet, you need to press button M to dismiss it.

```
kelvin eth kovan showaddr
kelvin eth kovan showaddr --account 0
kelvin eth kovan showaddr --account 1
kelvin eth kovan showaddr --account 2
```

### fees

Print suggested fee options for the selected cryptocurrency and network.

```
kelvin eth kovan fees
```

### signtx

Verify and sign transaction on KelvinWallet.

You can navigate transaction details on KelvinWallet using button L and button
R and confirm it using button M.  If you confirmed the transaction, the signed
result will be transferred back to PC and printed to stdout.

```
kelvin eth kovan signtx \
    --account 0 \
    --pubkey 04537e0634322c9867100989c89ccdeac1ca69cf64073a296255b6d5ac65984eeb9e449270e250ef1dc25c44f5d8b8be3dd8417cdb5995444cc39a333d65e98dd9 \
    --to 0x5FCD33dA14fbcb24607CE3986174A5315597e3F4 \
    --amount 3.14 \
    --fee 8
```

### broadcast

Submit signed transaction to the network

```
kelvin eth kovan broadcast \
    --tx 0xf86a820d098082520894330e02c080aa1e96c0f5d8ddfec9479387a31b4c893cb7c337151a71e5808077a0278ba1215e987dedafaf7cdaeaa0f6d4333a25088e5180194d22915b5edf5b21a0209b5b18084583c639463a1bd846781e199b17213823582b9e8b9039e5fbb1a5
```
