"use strict";

const envParser = require('rainu-env-parser');

let defaults = {
  server: {
    interface: '0.0.0.0',
    port: 3000,
    url: 'http://localhost:3000',
  },
  oauth2: {
    client: {
      id: "clientId",
      secret: "secret"
    },
    user: {
      name: "admin",
      password: "admin"
    }
  },
  mongo: {
    host: "localhost",
    port: 27017,
    db: "prod"
  },
  request: {
    timeout: 60000,
    repeatSleep: 1000,
    maxRetry: 10
  },
  crawler: {
    historical: {
      crypto:{
        interval: 36000000, //6h
      },
      fiat:{
        interval: 36000000, //6h
      }
    },
    ticker: {
      crypto: {
        interval: 300000,   //5min
        max: 2000,
      }
    }
  }
}

module.exports = {
  ...envParser.parse("CFG_", defaults)
};
