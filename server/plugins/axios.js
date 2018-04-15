export default function ({ $axios, app, store }) {
  $axios.onRequest(config => {

    /*
     * Here we have to close a hole: AUTH header
     * If the user reload a page (and he is still logged in) the "server-side-axios"
     * instance will have the Authorisation head (because of the logic inside the auth-store).
     * But the client-side-axios will not have the auth-header because no logic
     * will be executed after loading the content from the server! So we have
     * close these hole here!
    */
    if(config.url.startsWith('/api/') && !config.headers['common']['Authorization']){
      //we only protect "/api/" endpoints and assume that we always use the scope "common"
      config.headers['common']['Authorization'] = 'Bearer ' + store.state.auth.token
    }
  })
}
