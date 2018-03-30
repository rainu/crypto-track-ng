const routes = {
  startpage(store) {
    return `/${store.state.i18n.locale}`
  },
  userhome(store) {
    return `/${store.state.i18n.locale}/user/${store.state.auth.username}`
  },
  dashboard(store) {
    return `/${store.state.i18n.locale}/user/${store.state.auth.username}/dashboard`
  }
}

export const url = (target, store) => {
  if(routes.hasOwnProperty(target)) {
    return routes[target](store)
  }
}

export default ({ app }) => {
  app.router.$goto = (target) => {
    if(routes.hasOwnProperty(target)) {
      const store = app.store;
      const router = app.router;

      router.push(url(target, store))
    }
  }
}
