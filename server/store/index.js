import Vuex from "vuex";
import auth from './auth'
import i18n from './i18n'
import wallet from './wallet'
import transaction from './transaction'

const createStore = () => {
  return new Vuex.Store({
    modules: {
      auth, i18n, wallet, transaction
    },
    actions: {
      nuxtServerInit(vuexContext, nuxtContext) {
        return Promise.all([
          //all init functions have to return a promise
          //otherwise the store will not init completely before sending to client!
          vuexContext.dispatch('auth/init', nuxtContext),
          vuexContext.dispatch('wallet/init', nuxtContext),
          vuexContext.dispatch('transaction/init', nuxtContext)
        ])
      }
    }
  })
}

export default createStore;
