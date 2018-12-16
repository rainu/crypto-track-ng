//this is not a vuex-store! but a file for our localforage store
import moment from 'moment'
import localforage from 'localforage'

export function courses() {
  const store = {
    course: {
      historical: localforage.createInstance({
        driver: localforage.INDEXEDDB,
        version: 1.0,
        storeName: 'historical_courses', // Should be alphanumeric, with underscores.
      }),
      ticker: localforage.createInstance({
        driver: localforage.INDEXEDDB,
        version: 1.0,
        storeName: 'ticker_courses', // Should be alphanumeric, with underscores.
      })
    },
    pair: localforage.createInstance({
      driver: localforage.INDEXEDDB,
      version: 1.0,
      storeName: 'pairs', // Should be alphanumeric, with underscores.
    }),
    meta: localforage.createInstance({
      driver: localforage.INDEXEDDB,
      version: 1.0,
      storeName: 'meta', // Should be alphanumeric, with underscores.
    })
  }

  return {
    getLastDateSavedCourse(currency){
      return store.meta.getItem(`${currency.type}_${currency.name}__lastdate`)
    },
    setLastDateSavedCourse(currency, date) {
      return store.meta.setItem(`${currency.type}_${currency.name}__lastdate`, date.format('YYYY-MM-DD'))
    },
    addPair(cFrom, cTo) {
      return store.pair.setItem(`${cFrom.type}_${cFrom.name}__${cTo.type}_${cTo.name}`, {
        from: cFrom,
        to: cTo,
      })
    },
    getPairs(){
      let pairs = []
      return store.pair.iterate((value, key, iterationNumber) => {
        pairs.push(value)
      }).then(() => {
        return pairs
      })
    },
    saveHistoricalCourses(currency, courses){
      let p = []
      let lastDate;
      let pairs = {}

      for(let c of courses) {
        let date = moment(c.date).utc()

        if (!lastDate || lastDate.isBefore(date)) {
          lastDate = date;
        }

        let key = `${c.from.type}${c.from.name}${c.to.type}${c.to.name}`
        pairs[key] = [c.from, c.to]
        p.push(store.course.historical.setItem(
          `${c.from.type}_${c.from.name}__${c.to.type}_${c.to.name}__${date.format('YYYY-MM-DD')}`,
          c
        ))
      }

      for(let key of Object.keys(pairs)){
        p.push(this.addPair(pairs[key][0], pairs[key][1]))
      }

      if(lastDate) {
        p.push(this.setLastDateSavedCourse(currency, lastDate))
      }

      return Promise.all(p)
    },
    saveTickerCourses(currency, courses) {
      let p = []
      for(let c of courses) {
        p.push(store.course.ticker.setItem(
          `${c.currency.type}_${c.currency.name}__${c.price.currency.type}_${c.price.currency.name}`,
          c
        ))
        p.push(this.addPair(c.currency, c.price.currency))
      }

      return Promise.all(p)
    }
  }
}
