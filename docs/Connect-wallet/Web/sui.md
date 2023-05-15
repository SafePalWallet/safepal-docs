# Sui

This doc is for Sui Testnet. SafePal will update the doc as Sui upgrades.

- [Sui Documentation](https://docs.sui.io/learn)

 **This feature is supported by the following versions of SafePal Wallet.**
 
| platform           | version    | description      |
| ------------------ | ---------- | ---------------- |
| chrome Extension   | >=v2.12.0  | Testnet, Mainnet |
| App(ios)           | >=v3.9.2   | Testnet, Mainnet |
| App(android)       | >=v3.9.2   | Testnet, Mainnet |


## Quick access

Please refer to the recommended standard on the official website to access (for multiple wallet)

::: tip Note
Use the official adapter provided by [Sui Wallet Adapter](https://github.com/MystenLabs/sui/tree/main/sdk/wallet-adapter) , which is based on the [wallet-standard](https://github.com/wallet-standard/wallet-standard).
:::

- [Sui Wallet Adapter](https://github.com/MystenLabs/sui/tree/main/sdk/wallet-adapter)
- [wallet-standard](https://github.com/wallet-standard/wallet-standard)
- [demo](https://github.com/MystenLabs/sui/tree/main/sdk/wallet-adapter/example)
## npm package
  - [@mysten/wallet-kit](https://www.npmjs.com/package/@mysten/wallet-kit) 

## WalletKitProvider

### Description

The `WalletKitProvider` provides the essential data and functions for our kit. And it is the entrypoint for customized configurations.

:::tip

So you need to wrap all the kit hooks and components under `WalletKitProvider` before you start to use them.

:::


### Basic Usage

```jsx
import React from "react";
import ReactDOM from 'react-dom';
import { WalletKitProvider } from '@mysten/wallet-kit';

function Root() {
  // wrap your app component
  <React.StrictMode>
    <WalletKitProvider
      features={["sui:signTransactionBlock"]}
      enableUnsafeBurner
    >
      <App />
    </WalletKitProvider>
  </React.StrictMode>
}

ReactDOM.render(<Root />, docoument.getElementById('root'));
```
  
## useWalletKit

### Description

`useWalletKit` is the most useful React Hook to play with. For details of React Hook, check
the [React doc](https://reactjs.org/docs/hooks-intro.html).

It retrieves all the properties and functions from [WalletKitProvider](/Connect-wallet/Web/sui.html#walletprovider), with which you can
get properties and call functions of a connected wallet.

:::tip

Make sure it runs in a React component under `WalletKitProvider`

:::


### Basic Usage

We start with a simple senario like getting information from the connected wallet .

```jsx
import {useWalletKit} from '@mysten/wallet-kit'

function App() {
  const wallet = useWalletKit();
  console.log('wallet status', wallet.status)
}
```

### Sign and Execute Transactions

Sui introduces a new concept of [Programmable Transaction](https://github.com/MystenLabs/sui/issues/7790)
to make it flexible for developers to define transactions, such as allowing third-party to set gas payment and executing
batch transactions in one call.

> For more details of Programmable Transaction,
> check [Sui docs](https://docs.sui.io/devnet/doc-updates/sui-migration-guide#building-and-executing-transaction)

Here we define a `moveCall` transaction to implement a simple nft minting example.

```jsx
import {useWalletKit} from '@mysten/wallet-kit'
import { TransactionBlock } from "@mysten/sui.js";
function App() {
  const wallet = useWalletKit();

  async function handleSignAndExecuteTxBlock() {
    if (!wallet.connected) return

    // define a programmable transaction
    const tx = new TransactionBlock();
    const packageObjectId = "0xXXX";
    tx.moveCall({
      target: `${packageObjectId}::nft::mint`,
      arguments: [tx.pure("Example NFT")],
    });

    try {
      // execute the programmable transaction
      const resData = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx
      });
      console.log('nft minted successfully!', resData);
      alert('Congrats! your nft is minted!')
    } catch (e) {
      console.error('nft mint failed', e);
    }
  }

  return (
    <button onClick={handleSignAndExecuteTx}> Mint Your NFT !</button>
  )
}
```

### Sign Message

[Message signing](https://en.bitcoin.it/wiki/Message_signing#:~:text=Message%20signing%20is%20the%20action,they%20correspond%20to%20each%20other.)
is an important action to **verify whether an approval is confirmed by the owner of an account**.

It is useful for DApp to ask user's approval for senarios like approving Terms of Service and Privacy Policy (Below is
an example of message signing in OpenSea, the NFT marketplace in Ethereum)

Here is an example for signing a simple message "Hello World".

> Notice that all the params are Uint8Array (i.e. bytes) type. For browser app, you can
> use [TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder) to encode and decode.

```tsx
import {useWalletKit} from '@mysten/wallet-kit'
import * as tweetnacl from 'tweetnacl'

function App() {
  const wallet = useWalletKit();

  async function handleSignMsg() {
    try {
      const msg = 'Hello world!'
      // convert string to Uint8Array 
      const msgBytes = new TextEncoder().encode(msg)
      
      // call wallet's signMessage function
      const result = await wallet.signMessage({
        message: msgBytes
      })

    } catch (e) {
      console.error('signMessage failed', e)
    }
  }

  return (
    <button onClick={handleSignMsg}> Sign Message </button>
  )
}
```

## Types of Sui SDK

https://github.com/MystenLabs/sui/tree/main/sdk/typescript/src/types

### WalletAccount

```ts
export interface WalletAccount {
    /** Address of the account, corresponding with the public key. */
    readonly address: string;

    /** Public key of the account, corresponding with the secret key to sign, encrypt, or decrypt using. */
    readonly publicKey: Uint8Array;

    /** Chains supported by the account. */
    readonly chains: IdentifierArray;

    /** Features supported by the account. */
    readonly features: IdentifierArray;

    /** Optional user-friendly descriptive label or name for the account, to be displayed by apps. */
    readonly label?: string;

    /** Optional user-friendly icon for the account, to be displayed by apps. */
    readonly icon?: WalletIcon;
}
```