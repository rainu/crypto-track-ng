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
      storeName: 'course_meta', // Should be alphanumeric, with underscores.
    }),
  }

  const genKey = (fromCurrency, toCurrency = null, date = null) => {
    let key = `${fromCurrency.type}_${fromCurrency.name}`
    if(toCurrency) {
      key += `__${toCurrency.type}_${toCurrency.name}`
    }
    if(date) {
      key += `__${date.format('YYYY-MM-DD')}`
    }
    return key
  }

  return {
    ready(){
      return Promise.all([
        store.course.historical.ready(),
        store.course.ticker.ready(),
        store.pair.ready(),
        store.meta.ready()
      ])
    },
    getLastDateSavedCourse(currency){
      return store.meta.getItem(`${genKey(currency)}__lastdate`)
    },
    setLastDateSavedCourse(currency, date) {
      return store.meta.setItem(`${genKey(currency)}__lastdate`, date.format('YYYY-MM-DD'))
    },
    addPair(cFrom, cTo) {
      return store.pair.setItem(genKey(cFrom, cTo), {
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
    getHistoricalCourse(fromCurrency, toCurrency, date, backSteps = 0){
      //we have to fill gaps (at the weekend/hollidays we have no courses)
      return store.course.historical.getItem(genKey(fromCurrency, toCurrency, date)).then(value => {
        if(value) {
          return Promise.resolve(value)
        }

        if(backSteps >= 7 || backSteps < 0) {
          //go MAX 7 days back
          return Promise.resolve(value)
        }

        //go one day back
        return this.getHistoricalCourse(fromCurrency, toCurrency, date.clone().add(-1, 'days'), backSteps + 1)
          .then(value => {
            //we have to set the original date instead the "real" date
            if(value) value.date = date
            return value
          })
      })
    },
    getTickerCourse(fromCurrency, toCurrency){
      return store.course.ticker.getItem(genKey(fromCurrency, toCurrency))
        .then(course => {
          return course.price.amount
        })
    },
    saveHistoricalCourses(currency, courses){
      let p = []
      let lastDate;
      let pairs = {}

      for (let c of courses) {
        const date = moment(c.date).utc()

        if (!lastDate || lastDate.isBefore(date)) {
          lastDate = date;
        }

        let key = `${c.from.type}${c.from.name}${c.to.type}${c.to.name}`
        pairs[key] = [c.from, c.to]
        p.push(store.course.historical.setItem(genKey(c.from, c.to, date), c))
      }

      for (let key of Object.keys(pairs)) {
        p.push(this.addPair(pairs[key][0], pairs[key][1]))
      }

      if (lastDate) {
        p.push(this.setLastDateSavedCourse(currency, lastDate))
      }

      return Promise.all(p)
    },
    saveTickerCourses(currency, courses) {
      let p = []
      for(let c of courses) {
        p.push(store.course.ticker.setItem(genKey(c.currency, c.price.currency), c))
        p.push(this.addPair(c.currency, c.price.currency))
      }

      return Promise.all(p)
    },
  }
}
