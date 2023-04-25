## start
 It is best to use static service startup 
    
    npm http-server -g 
    http-server -p 3000




# Some third-party packages 
## [web3modal](https://github.com/Web3Modal/web3modal)
```
    import Web3Modal, { connectors } from "web3modal"
    
    this.web3Modal = new Web3Modal({
      network:'mainnet' ,
      cacheProvider: true,
      providerOptions: {
          "custom-injected": {
            display: {
            logo: "https://devdocs.safepal.com/sfp.png",
            name: "SafePal",
            description: "Managing Your Assets Just Got Easier",
            },
            package: connectors.injected,
            connector: async (ProviderPackage: any, options: any) => {
            const provider = new ProviderPackage(options)
            return provider
            }
      },
      }
    });
 ```   

   