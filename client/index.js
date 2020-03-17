/**
 * Test client for Websocket Serverless Offline
 */
// require('dotenv').config();
const WebsocketClient = require('websocket').client;

// Websocket client configuration
const client = new WebsocketClient();

client.on('connectFailed', error => {
  console.error('Connection attempt failed', error);
  client.abort();
});
client.on('connect', connection => {
  console.log('Connected!');
  connection.on('error', error => {
    console.error('Error during connection', error);
    connection.close();
  });
  connection.on('close', () => {
    console.log('Connection closed!');
  });
  connection.on('message', message => {
    console.log(`Received Message: ${message}`);
    const content = JSON.parse(message.utf8Data);
    switch (content.action) {
      case 'PING':
        console.log('Keeping alive');
        break;
      default:
        console.error('Unsupported response', content);
    }
  });

  // Websockets usually timeout and close automatically after being
  // idle for around a minute. This ping/pong implementation keeps
  // the socket alive pinging every 30 seconds
  const ping = () => {
    if (connection.connected) {
      // console.log('Pinging!');
      const pingMessage = {
        action: 'PING',
      };
      console.log('sending keep alive...');
      connection.sendUTF(JSON.stringify(pingMessage));
      setTimeout(ping, 30000);
    }
  };
  // Begin Ping sequence
  ping();
});

// Process configuration and execution
// Connection metadata: API Websocket host address and Cognito user auth :)

const host = 'ws://localhost:3001';

// Retrieve the access token
try {
  client.connect(`${host}`);
} catch (error) {
  console.error('Unable to initialize socket connection:\n', error.toString());
}
