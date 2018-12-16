const webpack = require('webpack')
const bodyParser = require('body-parser')
const config = require('./common/config')
const scrollBehavior = require('./server/plugins/scroll_behavior')

module.exports = {
  mode: 'spa',

  srcDir: 'server/',

  /*
  ** Headers of the page
  */
  head: {
    title: 'crypto-track',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Tracking your cryptocurrency portfolio' }
    ],
    script: [],
    link: [],
    bodyAttrs: {
      class: 'skin-black fixed layout-top-nav'
    }
  },

  manifest: {
    "name": "Tracking your cryptocurrency portfolio",
    "short_name": "CryptoTrack",
    "start_url": "/",
    "scope": ".",
    "display": "standalone",
    "orientation": "portrait-primary",
    "background_color": "#fff",
    "theme_color": "#008078",
    "description": "Tracking your cryptocurrency portfolio.",
    "dir": "ltr",
    "lang": "de-DE"
  },

  icon: {
    sizes: [16, 32, 120, 144, 152, 192, 384, 512]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#008078' },

  router: {
    middleware: ['i18n', 'usercheck', 'session_refresh'],
    scrollBehavior: scrollBehavior
  },

  /*
  ** Global CSS
  */
  css: [
    'bootstrap/dist/css/bootstrap.css',
    'admin-lte/dist/css/AdminLTE.min.css',
    'admin-lte/dist/css/skins/skin-black.min.css',
    'font-awesome/css/font-awesome.min.css',
    'cryptocoins-icons/webfont/cryptocoins.css',
    'cryptocoins-icons/webfont/cryptocoins-colors.css',
    'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css',
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/axios',
    '~/plugins/webworker',
    '~/plugins/init',
    '~/plugins/theme',
    '~/plugins/i18n',
    '~/plugins/route_helper',
    '~/plugins/global_components',

    //these plugins will only work on client side! (ssr == false)
    { src: '~/plugins/datepicker', ssr: false },
    { src: '~/plugins/vue-select', ssr: false },
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    'nuxt-device-detect'
  ],

  serverMiddleware: [
    require('morgan')('combined'),
    require('cookie-parser')(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    '~/backend/middleware/authentication',
    '~/backend/routes/authentication',
    '~/backend/routes/wallet',
    '~/backend/routes/transaction',
    '~/backend/routes/course',
    '~/backend/routes/backup'
  ],

  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    credentials: true,
    baseURL: `http://${config.server.interface}:${config.server.port}`,
    browserBaseURL: config.server.url
  },

  babel: {
    presets: ['es2015', 'stage-0', 'transform-es2015-modules-commonjs']
  },

  /*
  ** Build configuration
  */
  build: {
    plugins: [
      // set shortcuts as global for bootstrap
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        $: 'jquery',
      })
    ],
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

      if (ctx.isClient) {
        config.devtool = '#source-map'
      }

      /*
      * Required for HotModuleReloading to work with web-worker
      */
      config.output.globalObject = `(typeof self !== 'undefined' ? self : this)`
    }
  }
}
