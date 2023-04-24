# WalletConnect

## EVM(WebApp)

WalletConnect is an open protocol for connecting wallets and DApps (Web3 applications), which uses a bridge server to establish a remote connection between two applications and/or devices, scan a QR code to establish a connection and start communication. SafePal Wallet App now supports WalletConnect。

For more detailed document, please refer to the [https://docs.walletconnect.com](https://docs.walletconnect.com)

- [react-app.walletconnect.com](https://react-app.walletconnect.com/)
- [Web3 Provider](https://docs.walletconnect.com/quick-start/dapps/web3-provider)
- [Standalone Client](https://docs.walletconnect.com/quick-start/dapps/client)
- [example](https://github.com/WalletConnect/web-examples)

    npm install --save @walletconnect/client @walletconnect/qrcode-modal

```js
import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';

// Create a connector
const connector = new WalletConnect({
  bridge: 'https://bridge.walletconnect.org', // Required
  qrcodeModal: QRCodeModal,
});

// Check if connection is already established
if (!connector.connected) {
  // create new session
  connector.createSession();
}

// Subscribe to connection events
connector.on('connect', (error, payload) => {
  if (error) {
    throw error;
  }

  // Get provided accounts and chainId
  const { accounts, chainId } = payload.params[0];
});

connector.on('session_update', (error, payload) => {
  if (error) {
    throw error;
  }

  // Get updated accounts and chainId
  const { accounts, chainId } = payload.params[0];
});

connector.on('disconnect', (error, payload) => {
  if (error) {
    throw error;
  }

  // Delete connector
});
```


**Description**

- This option only supports EVM chains.
- If there’s a need to determine the SafePal package name, a list of package names can be made available upon request.

### Connect Wallet

Call SafePal Wallet through scheme and transfer the Wallet Connect data. Please fill in **`safepal`** for **scheme value**.

#### Instructions for data transfer

| Value       | Notes                                                             | Remarks                            |
| ----------- | ----------------------------------------------------------------- | ---------------------------------- |
| uriString   | Generate the corresponding WC connection through the WC generator | Interface access is time-sensitive |
| action      | value: `connect`                                                  |                                    |
| connectType | value: `wc`                                                       |                                    |

> You can proceed according to the exception in catch.

#### Request examples for different platforms

#### Android

```Java
final String uriString = "wc:e3504282-91c5-4d8b-ae93-6a767532aa20@1?bridge=https%3A%2F%2Fw.bridge.walletconnect.org&key=437444a526c310620482604dd904db09d1f3ef840a7278c5c593a298b3604b22";
final String action = "connect";
final String connectType = "wc";
final Uri uri = new Uri.Builder()
        .scheme("safepal")
        .appendQueryParameter("action", action)
        .appendQueryParameter("connectType", connectType)
        .appendQueryParameter("value", uriString)
        .build();
try {
    Intent intent = new Intent(
            Intent.ACTION_VIEW,
            uri
    );
    startActivity(intent);
}catch (Exception e){
    Log.e("startActivityFail",e.toString());
}
```

#### FLutter

```Dart
final  uriString = "wc:xxx?bridge=xxx&key=xxx";
final  action = "connect";
final  connectType = "wc";

 final queryParameters = {
   'action': action,
   'connectType': connectType,
   'value': uriString,
 };
 Uri scheme = Uri(scheme: 'safepal', queryParameters: queryParameters);
 if(await canLaunchUrl(scheme)){
   await wlaunchUrl(scheme);
 } else {
   KLog.e('launch app fail');
 }
```

#### iOS

```Java
- (NSURL *)getDeepLinkUrl:(NSDictionary *)params {
  NSString *_paramsString = [self encodeParams:params];
  NSString *_deepLinkString = [NSString stringWithFormat:@"safepal:?%@",_paramsString];
  return [NSURL URLWithString:_deepLinkString];
}
- (NSString *)encodeParams:(NSDictionary *)params {
  NSMutableString *tmpString = @"".copy;

  for (int i = 0; i < params.allKeys.count; i++) {
    NSString *_tmpValue = [NSString stringWithFormat:@"%@=%@", params.allKeys[i], [params objectForKey:params.allKeys[i]]];
    [tmpString appendString:[NSString stringWithFormat:@"&%@", _tmpValue]];
  }
  return tmpString;
}
```

#### Js

```JS
final String uriString = "wc:e3504282-91c5-4d8b-ae93-6a767532aa20@1?bridge=https%3A%2F%2Fw.bridge.walletconnect.org&key=437444a526c310620482604dd904db09d1f3ef840a7278c5c593a298b3604b22";
final String action = "connect";
final String connectType = "wc";

var linkUrl = 'safepal://?action=${action}&connectType=${connectType}&vale=${uriString}'
 <a href= linkUrl/>
```

### Signiture

Call SafePal Wallet through scheme and transfer the Wallet Connect data. Please fill in **`safepal`** for **scheme value**.

#### Instructions for data transfer

| Value       | Notes         |
| ----------- | ------------- | --- |
| action      | Value: `sign` |     |
| connectType | value: `wc`   |     |

#### Request examples for different platforms

#### Android

```Java
final String action = "sign";
final String connectType = "wc";
final Uri uri = new Uri.Builder()
        .scheme("safepal")
        .appendQueryParameter("action", action)
        .appendQueryParameter("connectType", connectType)
        .build();
try {
    Intent intent = new Intent(
            Intent.ACTION_VIEW,
            uri
    );
    startActivity(intent);
}catch (Exception e){
    Log.e("startActivityFail",e.toString());
}
```

#### FLutter

```Dart
final  action = "sign";
final  connectType = "wc";

 final queryParameters = {
   'action': action,
   'connectType': connectType,
 };
 Uri scheme = Uri(scheme: 'safepal', queryParameters: queryParameters);
 if(await canLaunchUrl(scheme)){
   await wlaunchUrl(scheme);
 } else {
   KLog.e('launch app fail');
 }
```

#### iOS

```Java
- (NSURL *)getDeepLinkUrl:(NSDictionary *)params {
  NSString *_paramsString = [self encodeParams:params];
  NSString *_deepLinkString = [NSString stringWithFormat:@"safepal:?%@",_paramsString];
  return [NSURL URLWithString:_deepLinkString];
}
- (NSString *)encodeParams:(NSDictionary *)params {
  NSMutableString *tmpString = @"".copy;

  for (int i = 0; i < params.allKeys.count; i++) {
    NSString *_tmpValue = [NSString stringWithFormat:@"%@=%@", params.allKeys[i], [params objectForKey:params.allKeys[i]]];
    [tmpString appendString:[NSString stringWithFormat:@"&%@", _tmpValue]];
  }
  return tmpString;
}
```

#### Js

```JS
final String action = "sign";
final String connectType = "wc";

var linkUrl = 'safepal://?action=${action}&connectType=${connectType}'
 <a href= linkUrl/>
```

### Send

Call SafePal Wallet through scheme and transfer the Wallet Connect data. Please fill in **`safepal`** for **scheme value**.

#### Instructions for data transfer

| Value       | Notes         |
| ----------- | ------------- | --- |
| action      | Value: `send` |     |
| connectType | Value: `wc`   |     |

#### Request examples for different platforms

#### Android

```Java
final String action = "send";
final String connectType = "wc";
final Uri uri = new Uri.Builder()
        .scheme("safepal")
        .appendQueryParameter("action", action)
        .appendQueryParameter("connectType", connectType)
        .build();
try {
    Intent intent = new Intent(
            Intent.ACTION_VIEW,
            uri
    );
    startActivity(intent);
}catch (Exception e){
    Log.e("startActivityFail",e.toString());
}
```

#### FLutter

```Dart
final  action = "send";
final  connectType = "wc";

 final queryParameters = {
   'action': action,
   'connectType': connectType,
 };
 Uri scheme = Uri(scheme: 'safepal', queryParameters: queryParameters);
 if(await canLaunchUrl(scheme)){
   await wlaunchUrl(scheme);
 } else {
   KLog.e('launch app fail');
 }
```

#### iOS

```Java
- (NSURL *)getDeepLinkUrl:(NSDictionary *)params {
  NSString *_paramsString = [self encodeParams:params];
  NSString *_deepLinkString = [NSString stringWithFormat:@"safepal:?%@",_paramsString];
  return [NSURL URLWithString:_deepLinkString];
}
- (NSString *)encodeParams:(NSDictionary *)params {
  NSMutableString *tmpString = @"".copy;

  for (int i = 0; i < params.allKeys.count; i++) {
    NSString *_tmpValue = [NSString stringWithFormat:@"%@=%@", params.allKeys[i], [params objectForKey:params.allKeys[i]]];
    [tmpString appendString:[NSString stringWithFormat:@"&%@", _tmpValue]];
  }
  return tmpString;
}
```

#### Js

```JS
final String action = "send";
final String connectType = "wc";

var linkUrl = 'safepal://?action=${action}&connectType=${connectType}'
 <a href= linkUrl/>
```
