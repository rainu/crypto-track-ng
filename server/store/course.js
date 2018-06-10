const _courseKey = function(course){
  let year = course.date.getFullYear();
  let month = ("" + course.date.getMonth()).padStart(2, "0");
  let day = ("" + course.date.getDay()).padStart(2, "0");

  return `${year}-${month}-${day}`
}

const _addHistoricalCourse = function(state, course){
  course.date = new Date(course.date);

  if(!state.historicalCourses[course.from.type]) {
    state.historicalCourses[course.from.type] = {};
  }
  if(!state.historicalCourses[course.from.type][course.from.name]) {
    state.historicalCourses[course.from.type][course.from.name] = {}
  }
  if(!state.historicalCourses[course.from.type][course.from.name][course.from]) {
    state.historicalCourses[course.from.type][course.from.name][course.from] = {}
  }
  if(!state.historicalCourses[course.from.type][course.from.name][course.to.type]) {
    state.historicalCourses[course.from.type][course.from.name][course.to.type] = {}
  }
  if(!state.historicalCourses[course.from.type][course.from.name][course.to.type][course.to.name]) {
    state.historicalCourses[course.from.type][course.from.name][course.to.type][course.to.name] = {}
  }

  state.historicalCourses[course.from.type][course.from.name][course.to.type][course.to.name][_courseKey(course)] = course
}

const state = () => ({
  historicalCourses: {},
  tickerCourses: {},
})

const mutations = {
  clearHistoricalCourses(state, currency){
    if(!state.historicalCourses[currency.type]) return;
    if(!state.historicalCourses[currency.type][currency.name]) return;

    state.historicalCourses[currency.type][currency.name] = {}
  },
  addHistoricalCourse(state, { currency, course }) {
    _addHistoricalCourse(state, course)
  },
  addHistoricalCourses(state, { currency, courses }){
    for(let course of courses) {
      _addHistoricalCourse(state, course)
    }
  },
  setTickerCourse(state, { currency, course }){
    if(!state.tickerCourses[course.currency.type]) {
      state.tickerCourses[course.currency.type] = {};
    }
    if(!state.tickerCourses[course.currency.type][course.currency.name]){
      state.tickerCourses[course.currency.type][course.currency.name] = {};
    }
    if(!state.tickerCourses[course.currency.type][course.currency.name][course.price.currency.type]){
      state.tickerCourses[course.currency.type][course.currency.name][course.price.currency.type] = {};
    }
    if(!state.tickerCourses[course.currency.type][course.currency.name][course.price.currency.type][course.price.currency.name]){
      state.tickerCourses[course.currency.type][course.currency.name][course.price.currency.type][course.price.currency.name] = {};
    }

    state.tickerCourses[course.currency.type][course.currency.name][course.price.currency.type][course.price.currency.name] = {
      price: course.price.amount,
      change: course.change
    }
  }
}

const actions = {
  init(vuexContext, nuxtContext){
    if(vuexContext.rootGetters['auth/isAuthenticated']){
      return Promise.all([
        vuexContext.dispatch('loadHistoricalCourses'),
        vuexContext.dispatch('loadTickerCourses'),
      ])
    }

    return Promise.resolve()
  },
  loadHistoricalCourses(ctx){
    const currencies = ctx.rootGetters['transaction/involvedCurrencies']()
    let p = []

    for(let currency of currencies) {
      let promise = this.$axios.get(`/api/course/${currency.type}/${currency.name}/historical`)
      .then(response => {
        ctx.commit('clearHistoricalCourses', currency)
        ctx.commit('addHistoricalCourses', { currency, courses: response.data })
      })

      p.push(promise);
    }

    return Promise.all(p);
  },
  loadTickerCourses(ctx) {
    const currencies = ctx.rootGetters['transaction/involvedCurrencies']()
    let p = []

    for(let currency of currencies) {
      let promise = this.$axios.get(`/api/course/${currency.type}/${currency.name}/ticker`)
      .then(response => {
        for(let course of response.data){
          ctx.commit('setTickerCourse', { currency, course })
        }
      })

      p.push(promise);
    }

    return Promise.all(p);
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
