# Generate ECDSA Signature for Arbitrary Data using KelvinWallet

KelvinWallet supports WYSIWYS signing flow for arbitrary 32-byte hash.

The function `doSignHash()` in [src/ethsignhash.ts](src/ethsignhash.ts)
demonstrates how to ask KelvinWallet to generate a secp256k1 ECDSA signature on
an arbitrary 32-byte hash value.  You can choose any BIP-32 path in the form of
`m/44'/60'/0'/0/x` to derive the key.  You may choose any hash function such as
SHA-256, Keccak-256, or SHA-3 to produce a digest of some variable-length
message.

The result signature length is 64 bytes, which is just the concatenation of two
256-bit unsigned integers (r and s) in big-endian representation.  You may
re-encode the signature into some different format (such as ASN.1 DER) for your
application use case.

## How to

```
# Step 0 - Set up your KelvinWallet device

# Step 1 - Clone the git repo
git clone https://github.com/KelvinWallet/kelvinjs-sdk
cd kelvinjs-sdk

# Step 2 - Install dependencies
yarn

# Step 3 - Plug in KelvinWallet, unlock it, navigate to the "Ready to approve transaction" screen

# Step 4 - Run the following command to check the public key for m/44'/60'/0'/0/{i} where x = 7
./bin/kelvin eth mainnet getpubkey --account 7

# Step 5 - Run the following command to sign the specified hash using m/44'/60'/0'/0/{x}
./bin/ethsignhash -i 7 A0A1A2A3A4A5A6A7A8A9AAABACADAEAFB0B1B2B3B4B5B6B7B8B9BABBBCBDBEBF

# Step 6 - verify the secp256k1 ECDSA signature you got using the corresponding public key
```
