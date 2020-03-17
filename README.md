# Diagnostic Serverless Websocket Demo

## Issue
When trying to respond to a WS message using the `Aws.ApiGatewayManagementApi` connector
in `serverless offline`, the connector's TCP connection is refused. However this works fine when deployed to AWS.

**Error Message:**
```
Unable to generate socket message Error: connect ECONNREFUSED 127.0.0.1:443
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1137:16) {
  message: 'connect ECONNREFUSED 127.0.0.1:443',
  errno: 'ECONNREFUSED',
  code: 'NetworkingError',
  syscall: 'connect',
  address: '127.0.0.1',
  port: 443,
  region: 'us-east-1',
  hostname: '',
  retryable: true,
  time: 2020-03-17T16:37:57.040Z
}
->StackTrace:
 Error: connect ECONNREFUSED 127.0.0.1:443
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1137:16)
```

**Offending Code:**
```Javascript
// See src/connector/apigateway.connector.js
class ApiGatewayConnector {
  constructor() {
    const CONNECTOR_OPTS = {
      apiVersion: '2018-11-29',
      endpoint: CONSTANTS.WEBSOCKET_API_ENDPOINT,
    };
    this._connector = new aws.ApiGatewayManagementApi(CONNECTOR_OPTS);
  }

  get connector() {
    return this._connector;
  }

  async generateSocketMessage(connectionId, data) {
    try {
      // This is the problem call where the Connection is refused
      // when sending a message to a WS client
      return await this._connector
        .postToConnection({
          ConnectionId: connectionId,
          Data: data,
        })
        .promise();
    } catch (error) {
      console.error('Unable to generate socket message', error);
      if (error.stack) {
        console.error('->StackTrace:\n', error.stack);
      }
      if (error.statusCode === 410) {
        console.log(`Removing stale connector ${connectionId}`);
      }
    }
  }
}
```

## To replicate issue:

1. `yarn` _(...obviously)_
1. `yarn offline` - start sls offline
1. Connect to `ws://localhost:3001` (I use the Websocket King extension) <br />
    This should connect fine
1. Send a message. My test message is:
```Json
{
 "action":"PING"
}
```
5. Sending this message will trigger the `ECONNREFUSED` error
6. Can also simultate with `yarn client` in another terminal

# Author
Bryan Vaz (@bryanvaz)