"use strict";

const log = require('./log');

const ENV_PREFIX = 'CFG_';

let config = {
  server: {
    interface: '0.0.0.0',
    port: 3000,
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
    repeatSleep: 1000,
    maxRetry: 10
  }
}

outer: for(let curEnv of Object.keys(process.env)) {
  if(curEnv.startsWith(ENV_PREFIX)) {
    let rawName = curEnv.substr(ENV_PREFIX.length).toLowerCase();
    let configVar = config;

    let path = rawName.split('_');
    for (let i = 0; i < path.length - 1; i++) {
      if(! configVar[path[i]] ) continue outer;

      configVar = configVar[path[i]];
    }

    configVar[path[path.length - 1]] = process.env[curEnv];
    log.info('Override value by Environment: ' + curEnv);
  }
}

module.exports = config;
