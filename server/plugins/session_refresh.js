//automatically refresh the session on every page transition

export default ({ app, store }) => {

  app.router.afterEach((to, from) => {
    store.dispatch('auth/refresh')
  });

}
