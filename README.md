# Gov-Smart Blockchain wallet & explorer

Gov-Smart Blockchain wallet is a fork of PandoraPay Wallet and is using Vue3. No SSR supported as it is intended to be a Single Page Application for Client usage.

## Compute Resource Hashes
https://www.srihash.org/

## Installation

1. run `npm install`
2. run `./prepare.sh`

## Development

### compile wasm dev mode

1. `cd ../Blockchain_Gov-Smart`
2. run `./scripts/build-wasm.sh main dev`
3. run `./scripts/build-wasm.sh helper dev`

### run webpack dev server 
3. run `npm run dev`

## Production

### compile wasm prod mode
1. cd `./Blockchain_Gov-Smart`
2. run `./scripts/build-wasm.sh main build brotli zopfli`
3. run `./scripts/build-wasm.sh helper build brotli zopfli`

### build wallet
1. run `npm run build`

## DOCS

[NGINX Setup](/wiki/nginx.md)

# DISCLAIMER:
This source code is released for research purposes only, with the intent of researching and studying a decentralized p2p network protocol.

PANDORAPAY IS AN OPEN SOURCE COMMUNITY DRIVEN RESEARCH PROJECT. THIS IS RESEARCH CODE PROVIDED TO YOU "AS IS" WITH NO WARRANTIES OF CORRECTNESS. IN NO EVENT SHALL THE CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES. USE AT YOUR OWN RISK.

You may not use this source code for any illegal or unethical purpose; including activities which would give rise to criminal or civil liability.

Under no event shall the Licensor be responsible for the activities, or any misdeeds, conducted by the Licensee.
