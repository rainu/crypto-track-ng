import {url} from '../plugins/route_helper'

export default function ({ isHMR, app, store, route, params, error, redirect }) {
  if(params.username && store.state.auth.username !== params.username) {
    if(!store.state.auth.username) {
      redirect( url("startpage", store) )
      return
    }

    //the user try to view the state of other user -> redirect them to home!
    redirect( url("userhome", store) )
  }
}
