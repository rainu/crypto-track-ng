const webpack = require('webpack')
const bodyParser = require('body-parser')

module.exports = {
  mode: 'universal',

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
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    bodyAttrs: {
      class: 'skin-black sidebar-mini'
    }
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#008078' },

  router: {
    middleware: ['i18n', 'usercheck']
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
    '~/plugins/bootstrap',
    '~/plugins/i18n',
    '~/plugins/route_helper',
    '~/plugins/global_components',

    //these plugins will only work on client side! (ssr == false)
    { src: '~/plugins/datepicker', ssr: false },
    { src: '~/plugins/vue-select', ssr: false }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
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
    '~/backend/routes/backup'
  ],

  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    credentials: true
  },

  /*
  ** Build configuration
  */
  build: {
    vendor: ['jquery', 'bootstrap', 'admin-lte', 'moment'],
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

    }
  }
}
