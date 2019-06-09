import * as balancesDB from '../store/balances_db'
import moment from "moment"

const state = () => ({
  syncStates: {
    historical: false,
    ticker: false
  },
  calcCache: {
    totalTickerBalance: {},
  },
})

const mutations = {
  setSyncStateForHistorical(state, syncState) {
    state.syncStates.historical = syncState
  },
  setSyncStateForTicker(state, syncState) {
    state.syncStates.ticker = syncState
    state.calcCache.totalTickerBalance = {}
  },
  setCalcCacheTotalTickerBalance(state, {key, balances}) {
    state.calcCache.totalTickerBalance[key] = balances
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
      p.push(this.$webworker.courseSync.syncHistoricalCourses(
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
      p.push(this.$webworker.courseSync.syncTickerCourses(
        userToken,
        currency
      ))
    }

    return Promise.all(p)
      .then(() => ctx.commit('setSyncStateForTicker', true))
  },

  getTotalTickerBalanceFor(ctx, counterCurrency) {
    let key = `${counterCurrency.type}_${counterCurrency.name}`

    if(ctx.state.calcCache.totalTickerBalance[key]) {
      return Promise.resolve(ctx.state.calcCache.totalTickerBalance[key])
    }

    //TODO: make sure that no duplicate calculations are running!

    let promises = []
    let balances = []

    for(let coin of ctx.rootGetters['wallet/totalBalances']()) {
      let p = this.$webworker.balance.calcTickerBalance(coin.amount, coin.currency, counterCurrency)
        .then(counterValue => {
          balances.push({
            ...coin,
            counterValue: {
              currency: counterCurrency,
              amount: counterValue
            }
          })
        })
      promises.push(p)
    }

    return Promise.all(promises)
      .then(() => ctx.commit('setCalcCacheTotalTickerBalance', {key: key, balances: balances}))
      .then(() => balances)
  },

  getHistoricalTotalAmountFor(ctx, {counterCurrency, from, until}) {
    let dbHandle = balancesDB.balances()

    from = moment(from).startOf('day')
    until = moment(until).startOf('day')

    let p = []
    for (let curDate = from; curDate.isSameOrBefore(until); curDate = curDate.clone().add(1, 'days')) {
      p.push(dbHandle.getTotalAmountAt(counterCurrency, curDate))
    }

    return Promise.all(p)
  },

  getHistoricalBalancesFor(ctx, {from, until}) {
    let dbHandle = balancesDB.balances()

    from = moment(from).startOf('day')
    until = moment(until).startOf('day')

    let p = []
    for (let curDate = from; curDate.isSameOrBefore(until); curDate = curDate.clone().add(1, 'days')) {
      p.push(dbHandle.getBalancesAt(curDate))
    }

    return Promise.all(p)
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
