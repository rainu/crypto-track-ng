import Vue from "vue";

const state = () => ({
  wallets: [],
})

const mutations = {
  setWallets(state, wallets) {
    state.wallets.length = 0
    state.wallets.push(...wallets)
  },
}

const actions = {
  init(vuexContext, nuxtContext){
    return new Promise((resolve, reject) => {
      if(vuexContext.rootGetters['auth/isAuthenticated']){
        vuexContext.dispatch('refreshWallets').then(() => {
          resolve()
        }).catch(() => {
          reject()
        })
      }
    });
  },
  refreshWallets(ctx){
    return new Promise((resolve, reject) => {
      this.$axios.get("/api/wallets").then(wallets => {
        ctx.commit('setWallets', wallets.data)
        resolve()
      }).catch(err => {
        console.log("Error while reading user wallets!", err)
        reject()
      })
    })
  }
}

const getters = {
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
