# kelvinjs-sdk

Use Node.js to interact with KelvinWallet.

This project provides a reference implementation of the KelvinWallet TypeScript
SDK which includes a CLI tool `kelvin` so that you can execute some quick shell
commands under your command prompts to interact with KelvinWallet USB devices
without writing extra code.

## Set Up Your Environment

Make sure your environment is properly set up following the instructions below

### Prerequisite

- Node.js v10
    - We need Node.js because the command line tool for interacting with
      KelvinWallet is a Node.js project whose source is written in TypeScript;
      currently only v10 is supported because of backward incompatible breaking
      changes introduced in new versions.
    - Run `node --version` to check if you have Node.js v10 installed
- Yarn
    - We need Yarn because this Node.js project use Yarn to manage package dependencies.
    - Run `yarn --version` to check if you have Yarn installed
- Python 3
    - We need Python because some dependencies in this project require building
      binary with Python scripts unfortunately.
- Git
    - We need Git to download source code packages from GitHub
    - Run `git --version` to check if you have Git installed

### Install the CLI

1.  Download this repository and switch working directory to the root of this repo

    - If you already have `git`:
        - Just clone it: `git clone https://github.com/KelvinWallet/kelvinjs-sdk`
        - Then cd into it: `cd kelvinjs-sdk`

    - If you don't have `git`:
        - Download [the latest master branch ZIP archive](https://github.com/KelvinWallet/kelvinjs-sdk/archive/master.zip) from GitHub
        - Extract the folder kelvinjs-sdk-master from the ZIP file
        - Then cd into it: `cd kelvinjs-sdk-master`

2.  Install all dependencies of this package

    ```
    yarn install --ignore-optional
    ```

3.  Check if `bin/kelvin` is ready to run:

    - If you are on Linux or macOS:
        ```
        bin/kelvin --version
        ```

    - If you are on Windows:
        ```
        bin\kelvin --version
        ```

Now you are ready to interact with KelvinWallet.

## Important Notes about Path to the `kelvin` Script

In the following sections, we will talk about some `kelvin` CLI commands.

However, if you don't change your "PATH" environment variable, running `kelvin`
commands directly in your command prompt will fail with an error message like
`kelvin: command not found` or `'kelvin' is not recognized as an internal or
external command, operable program or batch file.`.

Whenever you want to run a `kelvin ...` command, you should use a relative path
or an absolute path to refer to the actual `kelvin` script in this project.

You should:

1. use full path like `/home/user/kelvinjs-sdk/bin/kelvin` or `C:\Users\user\kelvinjs-sdk\bin\kelvin`, or
2. always remember to `cd` into this project directory first, then use `bin/kelvin` (or `bin\kelvin` on Windows), or
3. just add the path (the "bin" folder) to your PATH environment variable

TLDR: *When you see a command like `kelvin eth kovan getpubkey`, you might need
to run it as `your/path/to/kelvin eth kovan getpubkey` depending on your actual
setup.*

## CLI Overview

```
kelvin CURRENCY NETWORK ACTION [OPTIONS ...]

CURRENCY is one of:
    eth
    erc20
    btc
    ltc
    bch
    xrp
    trx

NETWORK (when CURRENCY is eth or erc20) is one of:
    mainnet
    ropsten
    kovan
    rinkeby

NETWORK (when CURRENCY is btc, ltc, bch, xrp, or trx) is one of:
    mainnet
    testnet

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
    --tokenaddr           required when CURRENCY is erc20
    --tokensymbol         required when CURRENCY is erc20
```

## CLI Usage Examples

You need to connect (via a USB cable) and unlock your KelvinWallet before
running commands with ACTION being `showaddr`, `getpubkey`, or `signtx`
described below.

### getpubkey

The resulting public key (in hex) will be printed to stdout.

```
kelvin eth kovan getpubkey --account 0
kelvin eth kovan getpubkey --account 1
kelvin eth kovan getpubkey --account 2

kelvin erc20 --tokensymbol WETH --tokenaddr 0xd0A1E359811322d97991E03f863a0C30C2cF029C kovan getpubkey --account 0

kelvin ltc testnet getpubkey --account 0

kelvin bch testnet getpubkey --account 0

kelvin xrp testnet getpubkey --account 0

kelvin trx testnet getpubkey --account 0
```

### toaddr

The resulting address will be printed to stdout.

```
kelvin eth kovan toaddr --pubkey 04537e0634322c9867100989c89ccdeac1ca69cf64073a296255b6d5ac65984eeb9e449270e250ef1dc25c44f5d8b8be3dd8417cdb5995444cc39a333d65e98dd9

kelvin erc20 --tokensymbol WETH --tokenaddr 0xd0A1E359811322d97991E03f863a0C30C2cF029C kovan toaddr --pubkey 04537e0634322c9867100989c89ccdeac1ca69cf64073a296255b6d5ac65984eeb9e449270e250ef1dc25c44f5d8b8be3dd8417cdb5995444cc39a333d65e98dd9

kelvin ltc testnet toaddr --pubkey 04537e0634322c9867100989c89ccdeac1ca69cf64073a296255b6d5ac65984eeb9e449270e250ef1dc25c44f5d8b8be3dd8417cdb5995444cc39a333d65e98dd9

kelvin bch testnet toaddr --pubkey 0445d9571cc2f74143006d30543010975b589b38a99b49a81dbfe34ada823cf9f5caf0186563583908ef78550750a2bc09b96fe2ecd6f88851fbfc22211cec5efc

kelvin xrp testnet toaddr --pubkey 04de03690233e91e133407d234d57b79f59582b9684c4f7e216ea99d6f8e650c09e4c0378388954be3fea64c839dc83ce291bd09ffac60f1ac7cade1a484da2ce5

kelvin trx testnet toaddr --pubkey 04a9666a5615cf02456de2f6965c5c03493e0c9c2e4f4b81735c0124a59aadd9d55a1edfdc14f142660388f78b2a8e0f79f9837cfdeaf62f8594a4dcb6d955cf92
```

### showaddr

The address will be printed on the OLED display of KelvinWallet.

On KelvinWallet, you need to press button M to dismiss it.

```
kelvin eth kovan showaddr
kelvin eth kovan showaddr --account 0
kelvin eth kovan showaddr --account 1
kelvin eth kovan showaddr --account 2

kelvin erc20 --tokensymbol WETH --tokenaddr 0xd0A1E359811322d97991E03f863a0C30C2cF029C kovan showaddr --account 0

kelvin ltc testnet showaddr --account 0
kelvin bch testnet showaddr --account 0
kelvin xrp testnet showaddr --account 0
kelvin trx testnet showaddr --account 0
```

### fees

Print suggested fee options for the selected cryptocurrency and network.

```
kelvin eth kovan fees

kelvin erc20 --tokensymbol WETH --tokenaddr 0xd0A1E359811322d97991E03f863a0C30C2cF029C kovan fees

kelvin ltc testnet fees

kelvin bch testnet fees
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

kelvin erc20 kovan signtx \
    --tokensymbol WETH \
    --tokenaddr 0xd0A1E359811322d97991E03f863a0C30C2cF029C \
    --account 1 \
    --pubkey 04fd089bf63b7bafe29f91e52becbf3e62d4959513dfce131852b80fa4f288cd410fb3711030bdae62ae94784f09e55329bcc3214e907982bc8c51f0d09c1f28d2 \
    --to 0xFF7886d2441F24c364ca2b6b93E306C1F48ecF12 \
    --amount 0.0001 \
    --fee 1

kelvin ltc testnet signtx \
    --account 0 \
    --pubkey 0411be1528cff183dfa82723f96443a20e3290a45eb482c217cd7c039b2cb8654676e296aa9603d5463a1104240fa1423f268674caec46d3cc0326fbd1fc8cc8e0 \
    --to QM2eW3QXYcCx4Pbsurvv4ZBGUcxLUtnFKR \
    --amount 0.001 \
    --fee 1000

kelvin bch testnet signtx \
    --account 0 \
    --pubkey 0445d9571cc2f74143006d30543010975b589b38a99b49a81dbfe34ada823cf9f5caf0186563583908ef78550750a2bc09b96fe2ecd6f88851fbfc22211cec5efc \
    --to bchtest:qzfglvvu8t04p79qnuu8xrvxqzxux0el45ez0evmzj \
    --amount 0.001 \
    --fee 1000

kelvin xrp testnet signtx \
    --account 0 \
    --pubkey 04de03690233e91e133407d234d57b79f59582b9684c4f7e216ea99d6f8e650c09e4c0378388954be3fea64c839dc83ce291bd09ffac60f1ac7cade1a484da2ce5 \
    --to rBw3ULwWwitgEzvFmssmJRNGYwsXiQ9Bnf \
    --amount 10

kelvin trx testnet signtx \
    --account 0 \
    --pubkey 04a9666a5615cf02456de2f6965c5c03493e0c9c2e4f4b81735c0124a59aadd9d55a1edfdc14f142660388f78b2a8e0f79f9837cfdeaf62f8594a4dcb6d955cf92 \
    --to TKB7thq3aDS2gzqPfJPHj4g1KRSJbBCHzU \
    --amount 10
```

### broadcast

Submit signed transaction to the network

```
kelvin eth kovan broadcast \
    --tx 0xf86a820d098082520894330e02c080aa1e96c0f5d8ddfec9479387a31b4c893cb7c337151a71e5808077a0278ba1215e987dedafaf7cdaeaa0f6d4333a25088e5180194d22915b5edf5b21a0209b5b18084583c639463a1bd846781e199b17213823582b9e8b9039e5fbb1a5

kelvin ltc testnet broadcast \
    --tx 010000000001016b2d0b35359505a7cd5644ec70b78989328141db8f8e882438962aab9895049400000000171600141c51f2cbe98d822a12e5cfda7d058ceb7ac4f19bffffffff02a08601000000000017a91404aa07fdd9b5a2e0339afff708ff9f9dea6999ea87baad0a000000000017a9141c229ac6c4928a7994d07b8552fc03374e35fe20870248304502210085ffdc18d388873f0f6d6a922fabd81bc2b0823e84ba667db32d654347c22fdb02205932532a8b75235455e38aff7abbc3c4879626023d684bb3012f47fd455ff3e9012102434b4913e58aef8861c026d4c6e0b070a5fccd27478e25e934359aafa5e3d01900000000

kelvin bch testnet broadcast \
    --tx 0200000001e5e6a93f343577a7ea7618560a867c0ad32f1f75368527df0c4ef7259e787f8e010000006a47304402201879bf6040be5dbc9c7c0b5e8cc91e2d7c74cab389ccbbf2f36641fd169ac76d02202eb05f3993b9990d8f28fdf12285db3cdc36d981e64a06452363cc63b0e8ec7341210245d9571cc2f74143006d30543010975b589b38a99b49a81dbfe34ada823cf9f5ffffffff02a0860100000000001976a914928fb19c3adf50f8a09f38730d86008dc33f3fad88ac5aea9400000000001976a9140ebaa63a505966bf183e647d303125e70261a9a288ac00000000

kelvin xrp testnet broadcast \
    --tx 12000022800000002400000006201B0013BC4561400000000098968068400000000000000C732103DE03690233E91E133407D234D57B79F59582B9684C4F7E216EA99D6F8E650C0974473045022100F60FC21BB7986A4417D29FC40D8387B90085FEC8EDC26ACC26692864B4EFB2C2022060254FA6D3E84401157782A0D03817FCC2F720F172F71AAA43818E2EE028F5F18114D3CE592EE037F3CFB5E906C5E09230716CBC23FC83146F6B0203D87AFF7A7BD88183DC304974616A9CA8

kelvin trx testnet broadcast \
    --tx '{"visible":false,"txID":"29a3bddcbfc6aba82f8bc874182289611b9049b667867f107d9d70d93205b5ba","raw_data":{"contract":[{"parameter":{"value":{"amount":10000000,"owner_address":"419f201aeb48b1e25c30a211ccf801fda41128478e","to_address":"4164f9dbbd04dc82e030bbe7da69907a0230265120"},"type_url":"type.googleapis.com/protocol.TransferContract"},"type":"TransferContract"}],"ref_block_bytes":"a7c0","ref_block_hash":"8ffc26ab7b39a1b9","expiration":1571303373759,"timestamp":1571299773759},"raw_data_hex":"0a02a7c022088ffc26ab7b39a1b940bff7eac7dd2d5a68080112640a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412330a15419f201aeb48b1e25c30a211ccf801fda41128478e12154164f9dbbd04dc82e030bbe7da69907a02302651201880ade20470bf9a8fc6dd2d","signature":["c4bce95674ec2d39f238eb606b7f080fb5a5dd5fa01b70beb2d9b09f6cfda0cc2abe235eaf44e00e3714aee1d7fc5fc623c11d2be4a7a3e64d057eaa3e98bb2900"]}'
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
