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
  })
}

export default createStore;
