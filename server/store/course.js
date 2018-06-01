const state = () => ({
  courses: {},
})

const mutations = {
  clearCourses(state, currency){
    if(!state.courses[currency.type]) return;
    if(!state.courses[currency.type][currency.name]) return;

    state.courses[currency.type][currency.name].length = 0
  },
  addCourse(state, { currency, course }) {
    if(!state.courses[currency.type]) {
      state.courses[currency.type] = {};
    }
    if(currency.type === 'crypto'){
      if(!state.courses[currency.type][currency.name]){
        state.courses[currency.type][currency.name] = [];
      }

      state.courses[currency.type][currency.name].push(course)
    }else if(currency.type === 'fiat'){
      if(!state.courses[currency.type][currency.name]){
        state.courses[currency.type][currency.name] = {};
      }
      if(!state.courses[currency.type][currency.name][course.to]){
        state.courses[currency.type][currency.name][course.to] = [];
      }

      state.courses[currency.type][currency.name][course.to].push(course)
    }else{
      console.log("ERROR: Unsupported currency type: " + currency.type)
    }
  },
}

const actions = {
  init(vuexContext, nuxtContext){
    if(vuexContext.rootGetters['auth/isAuthenticated']){
      return vuexContext.dispatch('loadCourses')
    }

    return Promise.resolve()
  },
  loadCourses(ctx){
    const currencies = ctx.rootGetters['transaction/involvedCurrencies']()
    let p = []

    for(let currency of currencies) {
      let promise = this.$axios.get(`/api/course/${currency.type}/${currency.name}`)
      .then(response => {
        ctx.commit('clearCourses', currency)
        for(let course of response.data){
          ctx.commit('addCourse', { currency, course })
        }
      })

      p.push(promise);
    }

    return Promise.all(p);
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
