import {calculateBalances, addToBalance} from '../functions/balances'

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
  },
  deleteWallet(state, id) {
    for(let i in state.wallets){
      if(state.wallets[i].id === id) {
        state.wallets.splice(i, 1)
      }
    }
  }
}

const actions = {
  init(vuexContext){
    if(vuexContext.rootGetters['auth/isAuthenticated']){
      return vuexContext.dispatch('refreshWallets')
    }else{
      return Promise.resolve()
    }
  },
  refreshWallets(ctx){
    return new Promise((resolve, reject) => {
      this.$axios.get("/api/wallet").then(response => {
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
  },
  deleteWallet(ctx, walletId) {
    return new Promise((resolve, reject) => {
      this.$axios.delete("/api/wallet/" + walletId).then(response => {
        ctx.commit('deleteWallet', walletId)
        resolve()
      }).catch(err => {
        console.log("Error while deleting user wallet!", err)
        reject()
      })
    })
  },
}

const getters = {
  byId: (state) => (id) => {
    return state.wallets.find(w => w.id === id)
  },
  transactions: (state, getters, rootState) => (id) => {
    return rootState.transaction.transactions.filter(tx => {
      if(tx.involvedWallets.findIndex(wId => wId === id) === -1){
        //this transaction has nothing to do with the given wallet
        return false;
      }

      return true;
    });
  },
  balances: (state, getters, rootState) => (id) => {
    let wallet = getters.byId(id)
    let transactions = getters.transactions(id)
    return calculateBalances(wallet, transactions);
  },
  totalBalances: (state, getters, rootState) => () => {
    let balances = []

    for(let curWallet of state.wallets) {
      let curWalletBalances = getters.balances(curWallet.id)

      for(let curBalance of curWalletBalances) {
        addToBalance(balances, curBalance.currency, curBalance.amount)
      }
    }

    return balances;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
