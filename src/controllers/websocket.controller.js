const apigatewayConnector = require('../connector/apigateway.connector');
const CONSTANTS = require('../constants');

const defaultSocketHandler = async (event /* , context */) => {
  try {
    console.debug(`event: ${JSON.stringify(event, null, 2)}`);
    const data = JSON.parse(event.body);
    const { action } = data;

    const { connectionId } = event.requestContext;
    switch (action) {
      case 'PING':
        const pingResponse = JSON.stringify({ action: 'PING', value: 'PONG' });
        await apigatewayConnector.generateSocketMessage(connectionId, pingResponse);
        break;
      default:
        const invalidResponse = JSON.stringify({ action: 'ERROR', error: 'Invalid request' });
        await apigatewayConnector.generateSocketMessage(connectionId, invalidResponse);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': CONSTANTS.CORS_ORIGIN,
      },
      body: 'Default socket response.',
    };
  } catch (err) {
    console.error('Unable to generate default response', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': CONSTANTS.CORS_ORIGIN,
      },
      body: 'Default socket response error.',
    };
  }
};

const handleSocketConnect = async (event /* , context */) => {
  try {
    console.debug(`event: ${JSON.stringify(event, null, 2)}`);
    const { connectionId } = event.requestContext;
    const { connectionType } = event.queryStringParameters || {
      connectionType: 'Unknown Connection Type',
    };

    console.log(`handleSocketConnect: ${connectionType} -> ${connectionId}`);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': CONSTANTS.CORS_ORIGIN,
      },
      body: 'Socket successfully registered.',
    };
  } catch (err) {
    console.error('Unable to initialize socket connection', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': CONSTANTS.CORS_ORIGIN,
      },
      body: 'Unable to register socket.',
    };
  }
};

const handleSocketDisconnect = async (event /* , context */) => {
  try {
    const { connectionId } = event.requestContext;

    console.log(`handleSocketDisconnect: ${connectionId}`);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': CONSTANTS.CORS_ORIGIN,
      },
      body: 'Socket successfully terminated.',
    };
  } catch (err) {
    console.error('Unable to terminate socket connection', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': CONSTANTS.CORS_ORIGIN,
      },
      body: 'Unable to terminate socket.',
    };
  }
};

module.exports = {
  defaultSocketHandler,
  handleSocketConnect,
  handleSocketDisconnect,
};
