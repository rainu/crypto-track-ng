const state = () => ({
  wallets: [],
})

const mutations = {
  clearWallets(state){
    state.wallets.length = 0
  },
  addWallet(state, wallet) {
    state.wallets.push(wallet)
  },
  setWallets(state, wallets) {
    state.wallets.push(...wallets)
  },
  setWallet(state, wallet) {
    let savedWallet = state.wallets.find(w => w.id === wallet.id);

    for(let key of Object.keys(savedWallet)){
      savedWallet[key] = wallet[key]
    }
  }
}

const actions = {
  init(vuexContext, nuxtContext){
    return new Promise((resolve, reject) => {
      if(vuexContext.rootGetters['auth/isAuthenticated']){
        vuexContext.dispatch('refreshWallets').then(() => {
          resolve()
        }).catch((err) => {
          reject(err)
        })
      }else{
        resolve()
      }
    });
  },
  refreshWallets(ctx){
    return new Promise((resolve, reject) => {
      this.$axios.get("/api/wallets").then(response => {
        ctx.commit('clearWallets')
        for(let walletContainer of response.data){
          ctx.commit('addWallet', {
            id: walletContainer.id,
            ...walletContainer.wallet
          })
        }
        resolve()
      }).catch(err => {
        console.log("Error while reading user wallets!", err)
        reject()
      })
    })
  },
  addWallet(ctx, wallet) {
    return new Promise((resolve, reject) => {
      this.$axios.post("/api/wallet", wallet).then(response => {
        let walletContainer = response.data
        ctx.commit('addWallet', {
          id: walletContainer.id,
          ...walletContainer.wallet
        })
        resolve()
      }).catch(err => {
        console.log("Error while adding new user wallet!", err)
        reject()
      })
    })
  },
  saveWallet(ctx, wallet) {
    return new Promise((resolve, reject) => {
      this.$axios.put("/api/wallet/" + wallet.id, wallet).then(response => {
        let walletContainer = response.data
        ctx.commit('setWallet', {
          id: walletContainer.id,
          ...walletContainer.wallet
        })
        resolve()
      }).catch(err => {
        console.log("Error while editing user wallet!", err)
        reject()
      })
    })
  }
}

const getters = {
  byId: (state) => (id) => {
    return state.wallets.find(w => w.id === id)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
