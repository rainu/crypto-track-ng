import moment from 'moment'

export default function ({ isHMR, app, store, route, params, error, redirect }) {
  const defaultLocale = app.i18n.fallbackLocale
  // If middleware is called from hot module replacement, ignore it
  if (isHMR) return

  if (!params.lang) {
    //no param in locale
    return redirect(`/${defaultLocale}/${route.fullPath}`.replace("//", "/"))
  }

  // Get locale from params
  const locale = params.lang || defaultLocale
  if (store.state.i18n.locales.indexOf(locale) === -1) {
    return error({ message: 'This page could not be found.', statusCode: 404 })
  }

  // Set locale
  store.commit('i18n/setLang', locale)
  app.i18n.locale = store.state.i18n.locale
  moment.locale(locale)
}
