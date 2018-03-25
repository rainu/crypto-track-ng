import Vuex from "vuex";
import auth from './auth'
import i18n from './i18n'

const createStore = () => {
  return new Vuex.Store({
    modules: {
      auth, i18n
    },
    actions: {
      nuxtServerInit(vuexContext, nuxtContext) {
        vuexContext.dispatch('auth/init', nuxtContext)
      }
    }
  })
}

export default createStore;
