
const express = require('express')
const { Nuxt, Builder } = require('nuxt')
const mongodb = require('./db');
const cfg = require('../../common/config');

const app = express()

// Import and Set Nuxt.js options
let config = require('../../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(cfg.server.port, cfg.server.interface)
  console.log('Server listening on http://' + cfg.server.interface + ':' + cfg.server.port) // eslint-disable-line no-console
}
start()
