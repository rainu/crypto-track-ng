import {url} from '../plugins/route_helper'

export default function ({ isHMR, app, store, route, params, error, redirect }) {
  store.dispatch('auth/refresh')
  .then(result => {
    if(result === 'invalid') {
      store.dispatch('auth/logout')
      redirect( url("startpage", store) )
    }
  })
}
