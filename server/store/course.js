const state = () => ({
  syncStates: {
    historical: false,
    ticker: false
  }
})

const mutations = {
  setSyncStateForHistorical(state, syncState) {
    state.syncStates.historical = syncState
  },
  setSyncStateForTicker(state, syncState) {
    state.syncStates.ticker = syncState
  }
}

const actions = {
  init(vuexContext){
    if(vuexContext.rootGetters['auth/isAuthenticated']){
      return Promise.all([
        vuexContext.dispatch('syncHistoricalCourses'),
        vuexContext.dispatch('syncTickerCourses')
      ])
    }

    return Promise.resolve()
  },
  syncHistoricalCourses(ctx) {
    const currencies = ctx.rootGetters['transaction/involvedCurrencies']()
    const userToken = ctx.rootState.auth.token

    let p = []
    p.push(ctx.commit('setSyncStateForHistorical', false))

    for(let currency of currencies) {
      p.push(this.$webworker.course.syncHistoricalCourses(
        userToken,
        currency
      ))
    }

    return Promise.all(p)
      .then(() => ctx.commit('setSyncStateForHistorical', true))
  },
  syncTickerCourses(ctx) {
    const currencies = ctx.rootGetters['transaction/involvedCurrencies']()
    const userToken = ctx.rootState.auth.token

    let p = []
    p.push(ctx.commit('setSyncStateForTicker', false))

    for(let currency of currencies) {
      p.push(this.$webworker.course.syncTickerCourses(
        userToken,
        currency
      ))
    }

    return Promise.all(p)
      .then(() => ctx.commit('setSyncStateForTicker', true))
  },
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
