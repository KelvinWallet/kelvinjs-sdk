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

The sample CLI usage would look like this:

```

$ ./bin/kelvin eth mainnet getpubkey --account 7
your pubkey for account 7 is:
04f6fd46a05241788376436c138e010d47c872d0014a44391ef3922ec4b83dc929279ff535cd16f4821d6e7406d4c0af06c2d27c7294b69977b9105f317e81962f


$ ./bin/ethsignhash -i 7 8ad2438ec20b287d59e906a41875ecd82385c0e572fe74014c57df5a658e0d08
Asking KelvinWallet to derive private key for path m/44'/60'/0'/0/7 and sign the 32-byte digest:
    8AD2438EC20B287D59E906A41875ECD82385C0E572FE74014C57DF5A658E0D08
KelvinWallet returned 64-byte secp256k1 ECDSA signature:
    1BA390374E4B118D019BD414405A816C2BB4A2651EECC7DAE5FB2950584626987E75D9D108C25A8049E33EB2338C02C04EC531BA3DA79CA034C6BC206FD39F3D

```
