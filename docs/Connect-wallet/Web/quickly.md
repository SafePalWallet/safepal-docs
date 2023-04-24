# Quickly support SafePal Wallet

## EVM

::: tip Note
 Precondition:
You have connected to Chrome extension wallets (including MetaMask) with the same protocol used to connect to MetaMask.
:::

**What’s the easiest way to connect to SafePal Wallet**

 Check if the provider is `window.safepalProvider`, if not, please replace it with the exclusive SafePal provider `window.safepalProvider`.

For example, see below:

```JS
function getProvider() {
  const provider = window.safepalProvider;
  if (!provider) {
    return window.open('https://www.safepal.com/download?product=2');
  }
  return provider;
}
```

**Attention**

Don't forget to remove listeners, once it is detected that the address and network have been changed.

For example, see below:

```JS
//SafePal used
const SafePalProvider = window.safepalProvider;

await SafePalProvider.request({ method: 'eth_requestAccounts' });

SafePalProvider.removeAllListeners();
SafePalProvider.on('accountsChanged', async (accounts) => {
   console.log("accounts changed")
});
SafePalProvider.on('chainChanged', async (chainId) => {
   console.log("chainId changed")
});

//MetaMask used
const MetaMaskProvider = window.ethereum;
//SafePalProvider.removeAllListeners();
MetaMaskProvider.request({ method: 'eth_requestAccounts' });
MetaMaskProvider.removeAllListeners();
MetaMaskProvider.on('accountsChanged', async (accounts) => {
  console.log("accounts changed")
});
MetaMaskProvider.on('chainChanged', async (chainId) => {
  console.log("chainId changed")
});
```

## Solana

::: tip Note
Precondition:
You have connected to Chrome extension wallets with the same protocol used to connect to MathWallet.
:::

**What’s the easiest way to connect to SafePal Wallet**

 Check if the provider is `window.safepal`, if not, please replace it with the exclusive SafePal provider `window.safepal`.

For example, see below:

```JS
function getProvider() {
  const provider = window.safepal;
  if (!provider) {
    return window.open('https://www.safepal.com/download?product=2');
    throw  `Please guide users to download from our official website`
  }
  return provider;
}
```

## Aptos

::: tip Note
Precondition:
You have connected to Chrome extension wallets with the same protocol of petra.
:::

**What’s the easiest way to connect to SafePal Wallet**

 Check if the provider is `window.safepalAptosProvider`, if not, please replace it with the exclusive SafePal provider `window.safepalAptosProvider`.

For example, see below:

```JS
function getAptosWallet() {
  const provider = window.safepalAptosProvider;
  if (!provider) {
   return window.open('https://www.safepal.com/download?product=2');
    throw 'Please go to  https://www.safepal.com/download?product=2  to download!!';
  }
  return provider;
}
```

## Other

If the developer has not connected to other Chrome extension wallets using the above standards, please refer to the access mechanism of other mainnet APIs or third-party npm packages to connect to SafePal Chrome extension wallet.

### API

- [EVM](/Connect-wallet/Web/ethereum.html)
- [Solana](/Connect-wallet/Web/solana.html)
- [Tron](/Connect-wallet/Web/tron.html)
- [Aptos](/Connect-wallet/Web/aptos.html)

### Third-party npm packages supported

**EVM**

- [web3js](https://www.npmjs.com/package/web3)
- [ethers](https://www.npmjs.com/package/ethers)

**Solana**

- [solana-web3.js](https://solana-labs.github.io/solana-web3.js/)
- [@solana/wallet-adapter-react](https://www.npmjs.com/package/@solana/wallet-adapter-react)
