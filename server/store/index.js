import Vuex from "vuex";
import auth from './auth'
import i18n from './i18n'
import wallet from './wallet'
import transaction from './transaction'
import course from './course'

const createStore = () => {
  return new Vuex.Store({
    modules: {
      auth, i18n, wallet, transaction, course
    },
    actions: {
      nuxtServerInit(vuexContext, nuxtContext) {
        //first we have init auth
        //after that we can init wallet and transactions parallel
        //  after we load the transactions we can load the needed course-data

        let authInit = vuexContext.dispatch('auth/init', nuxtContext);

        return authInit
          .then(() => Promise.all([
            vuexContext.dispatch('wallet/init', nuxtContext),
            vuexContext.dispatch('transaction/init', nuxtContext)
              .then(() => vuexContext.dispatch('course/init', nuxtContext))
          ]))
      }
    }
  })
}

export default createStore;
