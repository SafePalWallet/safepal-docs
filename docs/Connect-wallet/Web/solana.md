# Solana

:::tip Note
  You can  use third-party libraries in conjunction with `window.safepal`
:::
- library
    -  [solana-web3](https://solana-labs.github.io/solana-web3.js)
-  npm
    - [wallet-adapter](https://www.npmjs.com/package/@solana/wallet-adapter-react) 

## Installed or not

```js
const isSafePalInstalled = window.isSafePal;
```
https://github.com/solana-labs/wallet-adapter/tree/master/packages/wallets
## Provider

```js
function getProvider() {
  const provider = window.safepal;
  if (!provider) {
    return window.open('https://www.safepal.com/download?product=2');
    throw  `Please guide users to download from our official website`
  }
  return provider;
}
```

## connect(request authorization to connect)

```js
try {
  await window.safepal.connect();
  const publicKey = await window.safepal.getAccount();
  window.safepal.publicKey.toString(); // Once the web application is connected to SafePal,
} catch {
  alert('connected error');
}
```

## connected

```js
window.safepal.connected;
const publicKey = await window.safepal.getAccount();
window.safepal.publicKey.toString(); // Once the web application is connected to SafePal
```

## signMessage

```js
//string
window.safepal.signMessage(
  '020006106e655af38ff7324bbf1d4e16b06084763269b9'
);

// uint8Array
const message = `You can use uint8array to verify`;
const encodedMessage = new TextEncoder().encode(message);
const signedMessage = await window.safepal.signMessage(encodedMessage);
const nacl = require('tweetnacl');
const { PublicKey } = require('@solana/web3.js');
// nacl.sign.detached.verify(encodedMessage, signedMessage, publicKey)
nacl.sign.detached.verify(
  encodedMessage,
  signedMessage,
  new PublicKey(address).toBytes()
);
```

## Event listeners

used [eventemitter3](https://www.npmjs.com/package/eventemitter3)

```js
window.safepal.on('connect', () => console.log('connected!'));
```

## sendTransaction


You can refer to the following demo :
[Token demo](https://github.com/solana-labs/solana-program-library/tree/master/token/js/examples)

