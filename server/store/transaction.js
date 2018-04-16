const state = () => ({
  transactions: [],
})

const mutations = {
  clearTransactions(state){
    state.transactions.length = 0
  },
  addTransaction(state, transaction) {
    state.transactions.push(transaction)
  },
  setTransactions(state, transactions) {
    state.transactions.push(...transactions)
  },
  setTransaction(state, transaction) {
    let savedTx = state.transactions.find(t => t.id === transaction.id);

    for(let key of Object.keys(savedTx)){
      savedTx[key] = transaction[key]
    }
  },
  deleteTransaction(state, id) {
    for(let i in state.transactions){
      if(state.transactions[i].id === id) {
        state.transactions.splice(i, 1)
      }
    }
  }
}

const actions = {
  init(vuexContext, nuxtContext){
    return new Promise((resolve, reject) => {
      if(vuexContext.rootGetters['auth/isAuthenticated']){
        vuexContext.dispatch('refreshTransactions').then(() => {
          resolve()
        }).catch((err) => {
          reject(err)
        })
      }else{
        resolve()
      }
    });
  },
  refreshTransactions(ctx){
    return new Promise((resolve, reject) => {
      this.$axios.get("/api/transaction").then(response => {
        ctx.commit('clearTransactions')
        for(let transactionContainer of response.data){
          ctx.commit('addTransaction', {
            id: transactionContainer.id,
            ...transactionContainer.transaction
          })
        }
        resolve()
      }).catch(err => {
        console.log("Error while reading user transactions!", err)
        reject()
      })
    })
  },
  addTransaction(ctx, transaction) {
    return new Promise((resolve, reject) => {
      this.$axios.post("/api/transaction", transaction).then(response => {
        let transactionContainer = response.data
        ctx.commit('addTransaction', {
          id: transactionContainer.id,
          ...transactionContainer.transaction
        })
        resolve()
      }).catch(err => {
        console.log("Error while adding new user transaction!", err)
        reject()
      })
    })
  },
  saveTransaction(ctx, transaction) {
    return new Promise((resolve, reject) => {
      this.$axios.put("/api/transaction/" + transaction.id, transaction).then(response => {
        let transactionContainer = response.data
        ctx.commit('setTransaction', {
          id: transactionContainer.id,
          ...transactionContainer.transaction
        })
        resolve()
      }).catch(err => {
        console.log("Error while editing user transaction!", err)
        reject()
      })
    })
  },
  deleteTransaction(ctx, transactionId) {
    return new Promise((resolve, reject) => {
      this.$axios.delete("/api/transaction/" + transactionId).then(response => {
        ctx.commit('deleteTransaction', transactionId)
        resolve()
      }).catch(err => {
        console.log("Error while deleting user transaction!", err)
        reject()
      })
    })
  },
}

const getters = {
  byId: (state) => (id) => {
    return state.transactions.find(t => t.id === id)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
