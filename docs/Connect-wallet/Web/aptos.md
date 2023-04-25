# Aptos

To use SafePal Wallet with your dApp, your users must first install the SafePal Wallet Chrome extension in their browser. SafePal Wallet injects an `safepalAptosProvider` object into the [window](https://developer.mozilla.org/en-US/docs/Web/API/Window) of any web app the user visits.


## npm package
  - [Aptos Wallet Adapter](https://github.com/hippospace/aptos-wallet-adapter) 
  
## Installed or not

To check if the user has installed SafePal Wallet, perform the below check:

```js
const isSafePalInstalled = window.safepalAptosProvider;
```

## Detecting the Aptos provider

If SafePal Wallet is not installed, you can prompt the user to first install SafePal Wallet and provide the below installation instructions. For example, see below:

```js
function getAptosWallet() {
  const provider = window.safepalAptosProvider;
  if (!provider) {
    return window.open('https://www.safepal.com/download?product=2');
    throw  `Please guide users to download from our official website`
  }
  return provider;
}
```

## Connecting to SafePal Wallet

After confirming that the web app has the `safepalAptosProvider` object, we can connect to SafePal Wallet by calling `wallet.connect()`.

When you call `wallet.connect()`, it prompts the user to allow your web app to make additional calls to SafePal Wallet, and obtains from the user basic information such as the address and public key.

::: tip Note:
After the user has approved the connnection for the first time, the web app's domain will be remembered for the future sessions.
:::

See the example code below:

```js
const wallet = getAptosWallet();
try {
  const response = await wallet.connect();
  console.log(response); // { address: string, address: string }

  const account = await wallet.account();
  console.log(account); // { address: string, address: string }
} catch (error) {
  // { code: 4001, message: "User rejected the request."}
}
```

## Sending a Transaction

After your web app is connected to SafePal Wallet, the web app can prompt the user to sign and send transactions to the Aptos blockchain.

SafePal Wallet API handles the transactions in two ways:

1. Sign a transaction and submit it to the Aptos blockchain. Return a pending transaction to the web app.
2. Sign a transaction but do not submit the transaction to the Aptos blockchain. Return the signed transaction to the web app for the web app to submit the transaction.

See the below examples for both the options.

:::tip Note:
For more on Aptos transactions, see the
[Aptos SDKs](https://aptos.dev/sdks/index/).
:::

### Sign and submit

The below code example shows how to use the signAndSubmitTransaction() API to sign the transaction and send it to the Aptos blockchain.

```js
const wallet = getAptosWallet(); // see "Connecting"

// Example Transaction, following an [EntryFunctionPayload](https://github.com/aptos-labs/aptos-core/blob/main/ecosystem/typescript/sdk/src/generated/models/EntryFunctionPayload.ts#L8-L21)
const transaction = {
    arguments: [address, '717'],
    function: '0x1::coin::transfer',
    type: 'entry_function_payload',
    type_arguments: ['0x1::aptos_coin::TestCoin'],
};

/**
 *  Custom gas fee
 *  default {
        "gas_unit_price":"100",
        "max_gas_amount":"10000"
    }
 */
const options = {
    gas_unit_price:100,
    max_gas_amount:10000
} 

try {
    const pendingTransaction = await window.safepalAptosProvider.signAndSubmitTransaction(transaction);

    // const pendingTransaction = await window.safepalAptosProvider.signAndSubmitTransaction(transaction, options);

    // In most cases a dApp will want to wait for the transaction, in these cases you can use the typescript sdk
    const client = new AptosClient('https://testnet.aptoslabs.com');
    client.waitForTransaction(pendingTransaction.hash);
} catch (error) {
    // see "Errors"
}
```

### Sign only

**IMPORTANT**: We don't recommend using this because in most cases you don't need it, and it isn't super safe for users. They will receive an extra warning for this.

The below code example shows how to use the signTransaction() API to only sign the transaction, without submitting it to the Aptos blockchain.

```js
const wallet = getAptosWallet(); // see "Connecting"

// Example Transaction
const transaction = {
    arguments: [address, '717'],
    function: '0x1::coin::transfer',
    type: 'entry_function_payload',
    type_arguments: ['0x1::aptos_coin::TestCoin'],
};

/** Custom gas fee
 *  default {
        "gas_unit_price":"100",
        "max_gas_amount":"10000"
    }
 */
const options = {

    gas_unit_price: 100,
    max_gas_amount:10000
} 

try {
    const signTransaction = await window.safepalAptosProvider.signTransaction(transaction)
    // const signTransaction = await window.safepalAptosProvider.signTransaction(transaction, options)
} catch (error) {
    // see "Errors"
}

```

## Signing Messages

A web app can also request the user to sign a message, by using SafePal Wallet API: `wallet.signMessage(payload: SignMessagePayload)`

- `signMessage(payload: SignMessagePayload)` prompts the user with the payload.message to be signed
- returns `Promise<SignMessageResponse>`

Types:

```ts
export interface SignMessagePayload {
  address?: boolean; // Should we include the address of the account in the message
  application?: boolean; // Should we include the domain of the dapp
  chainId?: boolean; // Should we include the current chain id the wallet is connected to
  message: string; // The message to be signed and displayed to the user
  nonce: string; // A nonce the dapp should generate
}

export interface SignMessageResponse {
  address: string;
  application: string;
  chainId: number;
  fullMessage: string; // The message that was generated to sign
  message: string; // The message passed in by the user
  nonce: string;
  prefix: string; // Should always be APTOS
  signature: string; // The signed full message
}
```

### Example message

signMessage({nonce: 1234034, message: "Welcome to dapp!" })
This would generate the fullMessage to be signed and returned as the signature:

```text
    APTOS
    nonce: 1234034
    message: Welcome to dapp!
```

### Verifying

The most common use case for signing a message is to verify ownership of a private resource.

```js
import nacl from 'tweetnacl';

const message = "hello";
const nonce = "random_string"

try {
  const response = await window.safepalAptosProvider.signMessage({
    message,
    nonce,
  });
  const { publicKey } = await window.safepalAptosProvider.account();
  // Remove the 0x prefix
  const key = publicKey!.slice(2, 66);
  const verified = nacl.sign.detached.verify(Buffer.from(response.fullMessage),
                                             Buffer.from(response.signature, 'hex'),
                                             Buffer.from(key, 'hex'));
  console.log(verified);
} catch (error) {
  console.error(error);
}
```

## Event Listening

### onNetworkChange() and network()

A DApp may want to make sure a user is on the right network. In this case, you will need to check what network the wallet is using.
 
::: warning network
 We support network：
  `Mainnet` | `Devnet`

  'Testnet' has been modified to 'Mainnet'`    
:::

Default networks provided by the SafePal Wallet:

```ts
// default networks in the wallet
enum Network {
  Mainnet = 'Mainnet'
  Devnet = 'Devnet'
}

// Current network
let network = await window.safepalAptosProvider.network();

// event listener for network changing
window.safepalAptosProvider.onNetworkChange((newNetwork) => {
  network = newNetwork; // { networkName: 'Mainnet' }
});
```

### onAccountChange()

In SafePal Wallet, a user may change accounts while interacting with your app. To check for these events, listen for them with: onAccountChange

```ts
// get current account
let currentAccount = await window.safepalAptosProvider.account();

// event listener for disconnecting
window.safepalAptosProvider.onAccountChange((newAccount) => {
  // If the new account has already connected to your app then the newAccount will be returned
  if (newAccount) {
    currentAccount = newAccount;
  } else {
    // Otherwise you will need to ask to connect to the new account
    currentAccount = window.safepalAptosProvider.connect();
  }
});
```

## Errors

When making requests to SafePal Wallet API, you may receive an error. The following is a partial list of the possible errors and their corresponding codes:

```js
 {
    code: 4100,
    message:"The requested method and/or account has not been authorized by the user."
 }
```

- 4100 The requested method and/or account has not been authorized by the user.
- 4000 No accounts found.
- 4001 The user rejected the request
