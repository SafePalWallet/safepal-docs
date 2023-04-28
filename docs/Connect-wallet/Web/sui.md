# Sui(updating..)

This doc is for Sui Testnet. SafePal will update the doc as Sui upgrades.

- [Sui Documentation](https://docs.sui.io/learn)

 **This feature is supported by the following versions of SafePal Wallet.**
 
| platform           | version    | description     |
| ------------------ | ---------- | ----------------|
| chrome Extension   | >=v2.12.0  | testnet         |
| App(ios)           | >=v3.9.1   | testnet         |
| App(android)       | >=v3.9.1   | testnet         |


## npm package
  - [@mysten/wallet-kit](https://www.npmjs.com/package/@mysten/wallet-kit) 

## WalletProvider

### Description

The `WalletProvider` provides the essential data and functions for our kit. And it is the entrypoint for customized configurations.

:::tip

So you need to wrap all the kit hooks and components under `WalletProvider` before you start to use them.

:::


### Basic Usage

```jsx
import ReactDOM from 'react-dom';
import { useWallet } from '@mysten/wallet-kit';

function Root() {
  // wrap your app component
  <WalletProvider>
    <App />
  </WalletProvider>;
}

ReactDOM.render(<Root />, docoument.getElementById('root'));
```
  
## useWallet

### Description

`useWallet` is the most useful React Hook to play with. For details of React Hook, check
the [React doc](https://reactjs.org/docs/hooks-intro.html).

It retrieves all the properties and functions from [WalletProvider](/Connect-wallet/Web/sui.html#walletprovider), with which you can
get properties and call functions of a connected wallet.

:::tip

Make sure it runs in a React component under `WalletProvider`

:::


### Basic Usage

We start with a simple senario like getting information from the connected wallet .

```jsx
import {useWallet} from '@mysten/wallet-kit'

function App() {
  const wallet = useWallet();
  console.log('wallet status', wallet.status)
  console.log('connected wallet name', wallet.name)
  console.log('connected account info', wallet.account)
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
import {useWallet} from '@mysten/wallet-kit'

function App() {
  const wallet = useWallet();

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
import {useWallet} from '@mysten/wallet-kit'
import * as tweetnacl from 'tweetnacl'

function App() {
  const wallet = useWallet();

  async function handleSignMsg() {
    try {
      const msg = 'Hello world!'
      // convert string to Uint8Array 
      const msgBytes = new TextEncoder().encode(msg)
      
      // call wallet's signMessage function
      const result = await wallet.signMessage({
        message: msgBytes
      })
			// verify signature with publicKey and SignedMessage (params are all included in result)
      const verifyResult = wallet.verifySignedMessage(result)
      if (!verifyResult) {
        console.log('signMessage succeed, but verify signedMessage failed')
      } else {
        console.log('signMessage succeed, and verify signedMessage succeed!')
      }
    } catch (e) {
      console.error('signMessage failed', e)
    }
  }

  return (
    <button onClick={handleSignMsg}> Sign Message </button>
  )
}
```

### Get the connected chain (network) of wallet

::: warning

Since this is not a standard feature, not all the wallet has implemented. 

:::


Your dapp can get the current connected chain of wallet. 


However, if **user switches network inside the wallet**, the value **WOULD NOT** get updated. 

This is because Sui team suggests each dapp should separate the environments for each chain (sui:devnet, sui:testnet). 
And the active chain returned by the connected wallet could be used to match the dapp's environment.

In a nutshell, eliminating the need to switch network for dapp is a better user experience for a long term.

```tsx
import {useWallet} from '@mysten/wallet-kit'
import * as tweetnacl from 'tweetnacl'

function App() {
  const wallet = useWallet();

  useEffect(() => {
    if (!wallet.connected) return;
    console.log('current connected chain (network)', wallet.chain?.name)  // example output: "sui:devnet" or "sui:testnet"
  }, [wallet.connected])
}
```

## API References

### name

The name of connected wallet.

| Type                | Default   |
| ------------------- | --------- |
| string \| undefined | undefined |

### connection status

The connection status of wallet.

| Properties | Type                                             | Default        |
| ---------- | ------------------------------------------------ | -------------- |
| connecting | boolean                                          | false          |
| connected  | boolean                                          | false          |
| status     | 'disconnected' \| 'connecting' \| 'connected' | 'disconnected' |

```ts
const {status, connected, connecting} = useWallet();

// the assert expressions are equally the same
assert(status === 'disconnected', !connecting && !connected); // not connect to wallet
assert(status === 'connecting', connecting); // now connecting to the wallet
assert(status === 'connected', connected); // connected to the wallet
```

### account

The account info in the connected wallet, including address, publicKey etc.

| Type                                       | Default   |
| ------------------------------------------ | --------- |
| [WalletAccount](#walletaccount) | undefined |

```ts
const {connected, account} = useWallet();

function printAccountInfo() {
  if (!connected) return
  console.log(account?.address)
  console.log(account?.publicKey)
}
```

### address

Alias for `account.address`

### select

| Type                         | Default |
| ---------------------------- | ------- |
| (WalletName: string) => void |         |

### getAccounts

Get all the accessible accounts returned by wallet.

| Type                    | Default |
| ----------------------- | ------- |
| () => Promise<string[]> |         |

The getAccounts will get the current wallet's account address. Now one wallet only have one account.

```jsx
import {useWallet} from '@mysten/wallet-kit';

function YourComponent() {
  const wallet = useWallet();

  function handleGetAccounts() {
    if (!wallet.connected) return
    getAccounts().then((accounts) => {
      console.log(accounts);
    })
  }
}
```

### chains

Configuration of supported chains from WalletProvider

| Type                          | Default                             |
| ----------------------------- | ----------------------------------- |
| [Chain](/Connect-wallet/Web/sui.html#chain-2)[] | [DefaultChains](/Connect-wallet/Web/sui.html#chain-2) |

### chain

Current connected chain of wallet.

Might not be synced with the wallet if the wallet doesn't support wallet-standard "change" event.

| Type   | Default                                                      |
| ------ | ------------------------------------------------------------ |
| string | the first value of configured [chains](/Connect-wallet/Web/sui.html#chain-2) or [UnknownChain](/Connect-wallet/Web/sui.html#chain-2) |

### adapter

The adapter normalized from the raw adapter of the connected wallet. You can call all the properties and functions on
it, which is followed
the [@mysten/wallet-standard](https://github.com/MystenLabs/sui/tree/main/sdk/wallet-adapter/wallet-standard)


### signAndExecuteTransactionBlock

The universal function to send and execute transactions via connected wallet.

| Type                                                                                                                                                                                    | Default |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| ------- |
| `({transactionBlock: TransactionBlock, requestType?: ExecuteTransactionRequestType, options?: SuiTransactionBlockResponseOptions}) => Promise<SuiSignAndExecuteTransactionBlockOutput>` |         |

### signMessage

The function is for message signing.

| Type                                                                                   | Default |
|----------------------------------------------------------------------------------------| ------- |
| `(input: {message: Uint8Array}) => Promise<{signature: string; messageBytes: string}>` |         |

### verifySignedMessage

This function is for verifying the output of `signMessage` following the Sui standard. Uses `tweetnacl.sign.detached.verify` method under the hood. Returns `true` if the returned signature matches the message to be signed and the signer's publicKey.

| Type                                                         | Default |
| ------------------------------------------------------------ | ------- |
| `(input: {signature: string; messageBytes: string}) => boolean` |         |

### on

The function for wallet event listening. Returns the off function to remove listener.

| Type                                                         | Default |
| ------------------------------------------------------------ | ------- |
| `<E extends WalletEvent>(event: E, listener: WalletEventListeners[E], ) => () => void;` |         |

All the wallet events:

| Event         | Listener                                                     | Description                                               |
| ------------- | ------------------------------------------------------------ | --------------------------------------------------------- |
| accountChange | `(params: { account: WalletAccount; }) => void;`             | Emit when wallet app changes its account                  |
| featureChange | `(params: { features: string[]; }) => void;`                 | Emit when wallet app changes its wallet-standard features |
| change        | `(params: { chain?: string, account?: WalletAccount; features?: string[]; }) => void;` | Raw change event defined by wallet-standard               |

## Customize Wallet List

You can configure your wallet list on the select modal by passing `defaultWallets` throught `<WalletProvider />`.

### Default Usage

:::tip

All the `defaultWallets` will be listed in the Popular section on the wallet-select modal.

:::

```jsx
import {
  WalletProvider,
  IDefaultWallet,
} from '@mysten/wallet-kit';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WalletProvider defaultWallets={[
      // order defined by you

      // ...
    ]}>
    {/* or just leave it as default which contains all preset wallets */}
    {/*<WalletProvider>*/}
      <App />
    </WalletProvider>
  </React.StrictMode>
)
```

### Using Hook Only

If you use our `useWallet` hook only and have a customized wallet-select modal, then you can access configured wallet list by `configuredWallets` from `useWallet`. Also we provide `detectedWallets` for those wallets which are not preconfigured but detected from user browser.

```tsx
// make sure this code is under <WalletProvider />

function App() {
  const {configuredWallets, detectedWallets} = useWallet();
  
  return (
    <>
      <CustomizedWalletModal list={[...configuredWallets, ...detectedWallets]} />
    </>
  )
}
```

### Define New Wallet

If our wallet presets do not cover the wallets you need, you can simply define it using our  `defineWallet` function.

```jsx
import {
  WalletProvider,
  defineWallet,
} from '@mysten/wallet-kit';

// customized wallet must support @mysten/wallet-standard
const CustomizeWallet = defineWallet({
  name: "myWallet",
  iconUrl: "external url or data url",
  downloadUrl: {
    browserExtension: 'download page url of chrome extension...'
  },
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WalletProvider defaultWallets={[
      CustomizeWallet,
      // ...
    ]}>
      <App />
    </WalletProvider>
  </React.StrictMode>
)
```

## Configure supported chains (networks)

You can configure the supported chains (networks) for your dapp.

```tsx
import {
  WalletProvider,
  Chain,
  SuiDevnetChain,
  SuiTestnetChain,
  DefaultChains,
} from '@mysten/wallet-kit';

const customChain: Chain = {
  id: "",
  name: "",
  rpcUrl: ""
}

const SupportedChains: Chain[] = [
  // ...DefaultChains,
  SuiDevnetChain,
  SuiTestnetChain,
  // NOTE: you can add custom chain (network),
  // but make sure the connected wallet does support it
  // customChain,
]

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WalletProvider chains={SupportedChains}>
      <App/>
    </WalletProvider>
  </React.StrictMode>
)

```

## Types of Sui SDK

https://github.com/MystenLabs/sui/tree/main/sdk/typescript/src/types

### IDefaultWallet

```typescript
export interface IDefaultWallet {
  name: string;  // wallet name
  iconUrl: string;  // wallet icon url (external url or data url)
  downloadUrl: {
    browserExtension?: string;  // provide download link if this wallet is not installed
  };
}
```

example for customized defaultWallet item: 

```typescript
import IDefaultWallet from '@mysten/wallet-kit';

const myWallet: IDefaultWallet = {
  name: "myWallet",
  iconUrl: "external url or data url",
  downloadUrl: {
    browserExtension: 'chrome extension store url...'
  },
}
```

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

### Chain

Definition of chain's structure (aka Network for Sui Wallet)

```ts
export type Chain = {
  id: string;
  name: string;
  rpcUrl: string;
};
```

Default constants:

```ts
export const SuiDevnetChain: Chain = {
  id: 'sui:devnet',
  name: 'Sui Devnet',
  rpcUrl: 'https://fullnode.devnet.sui.io/',
}
export const SuiTestnetChain: Chain = {
  id: 'sui:testnet',
  name: 'Sui Testnet',
  rpcUrl: 'https://fullnode.testnet.sui.io/',
}

export const UnknownChain: Chain = {
  id: 'unknown:unknown',
  name: 'Unknown Network',
  rpcUrl: '',
}

export const DefaultChains = [
  SuiDevnetChain,
  SuiTestnetChain,
]
```

### Error Types

```typescript
type BaseError = {
  message: string;
  code: ErrorCode;
  details?: Record<String, any>;
}
type KitError = BaseError;  // errors from kit internal logics
type WalletError = BaseError;  // erros from third-party wallets
```

### Error Codes

```typescript
enum ErrorCode {
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  KIT__UNKNOWN_ERROR = "KIT.UNKNOWN_ERROR",
  WALLET__UNKNOWN_ERROR = "WALLET.UNKNOWN_ERROR",
  WALLET__CONNECT_ERROR = "WALLET.CONNECT_ERROR",
  WALLET__DISCONNECT_ERROR = "WALLET.DISCONNECT_ERROR",
  WALLET__SIGN_TX_ERROR = "WALLET.SIGN_TX_ERROR",
  WALLET__SIGN_MSG_ERROR = "WALLET.SIGN_MSG_ERROR",
  WALLET__LISTEN_TO_EVENT_ERROR = "WALLET.LISTEN_TO_EVENT_ERROR",
  WALLET__METHOD_NOT_IMPLEMENTED_ERROR = "WALLET.METHOD_NOT_IMPLEMENTED_ERROR",
}
```
