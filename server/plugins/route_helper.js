const routes = {
  startpage(store, ...parameter) {
    return `/${store.state.i18n.locale}`
  },
  userhome(store, ...parameter) {
    return `/${store.state.i18n.locale}/user/${store.state.auth.username}`
  },
  dashboard(store, ...parameter) {
    return `/${store.state.i18n.locale}/user/${store.state.auth.username}/dashboard`
  },
  wallets(store, ...parameter) {
    return `/${store.state.i18n.locale}/user/${store.state.auth.username}/wallet`
  },
  transactions(store, ...parameter) {
    return `/${store.state.i18n.locale}/user/${store.state.auth.username}/transaction`
  }
}

export const url = (target, store, ...parameter) => {
  if(routes.hasOwnProperty(target)) {
    return routes[target](store, parameter)
  }
}

export default ({ app }) => {
  app.router.$goto = (target, ...parameter) => {
    if(routes.hasOwnProperty(target)) {
      const store = app.store;
      const router = app.router;

      router.push(url(target, store, ...parameter))
    }
  }
}
