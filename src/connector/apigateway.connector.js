const aws = require('aws-sdk');

const CONSTANTS = require('../constants');

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
      // This is the problem call where the Connection is Refused
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

const APIGW_CONNECTOR = new ApiGatewayConnector();
module.exports = APIGW_CONNECTOR;
