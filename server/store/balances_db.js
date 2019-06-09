//this is not a vuex-store! but a file for our localforage store
import localforage from 'localforage'

export function balances() {
  const store = {
    balance: localforage.createInstance({
      driver: localforage.INDEXEDDB,
      version: 1.0,
      storeName: 'balance', // Should be alphanumeric, with underscores.
    }),
    meta: localforage.createInstance({
      driver: localforage.INDEXEDDB,
      version: 1.0,
      storeName: 'balance_meta', // Should be alphanumeric, with underscores.
    }),
  }

  return {
    ready() {
      return Promise.all([
        store.balance.ready(),
        store.meta.ready(),
      ])
    },
    saveLastCalcHistoricalBalances(from, until){
      return store.meta.setItem("lastCalcHistoricalDates", {
        from: from.format('YYYY-MM-DD'),
        until: until.format('YYYY-MM-DD'),
      })
    },
    getLastCalcHistoricalBalances(){
      return store.meta.getItem("lastCalcHistoricalDates")
    },
    saveBalancesAt(balances, date) {
      let key = date.format('YYYY-MM-DD')
      return store.balance.setItem(key, balances)
    },
    getBalancesAt(date) {
      let key = date.format('YYYY-MM-DD')
      return store.balance.getItem(key)
    },
    getBalanceDates() {
      return store.balance.keys()
        .then(keys => {
          keys = keys.filter(k => !k.startsWith("total"))
          keys.sort((a, b) => a.localeCompare(b))

          return keys
        })
    },
    saveTotalAmountAt(amount, currency, date) {
      let fDate = date.format('YYYY-MM-DD')
      let key = `total_${currency.type}_${currency.name}_${fDate}`
      return store.balance.setItem(key, {
        amount: amount,
        currency: currency,
        date: fDate
      })
    },
    getTotalAmountAt(currency, date) {
      let fDate = date.format('YYYY-MM-DD')
      let key = `total_${currency.type}_${currency.name}_${fDate}`
      return store.balance.getItem(key)
    }
  }
}
