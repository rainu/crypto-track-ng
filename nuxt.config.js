const pkg = require('./package')
const webpack = require('webpack')
const bodyParser = require('body-parser')

module.exports = {
  mode: 'universal',

  srcDir: 'server/',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
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
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/bootstrap',
    '~/plugins/i18n',
    '~/plugins/route_helper',
    '~/plugins/global_components'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    // Doc: https://bootstrap-vue.js.org/docs/
    // 'bootstrap-vue/nuxt'
  ],

  serverMiddleware: [
    require('morgan')('combined'),
    require('cookie-parser')(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    '~/backend/middleware/authentication',
    '~/backend/routes/authentication',
    '~/backend/routes/version'
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
    vendor: ['jquery', 'bootstrap', 'admin-lte'],
    plugins: [
      // set shortcuts as global for bootstrap
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      })
    ],
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    }
  }
}
