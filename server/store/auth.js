import Cookie from "js-cookie";
import HttpStatus from 'http-status-codes';

const COOKIE_JWT = "JWT"

const state = () => ({
  username: null,
  token: null,
  expiresAt: null,
})

const mutations = {
  setToken(state, {username, token, expiresAt}) {
    state.username = username;
    state.token = token;
    state.expiresAt = expiresAt;

    Cookie.set(COOKIE_JWT, JSON.stringify({
      username, token, expiresAt
    }), {
      expires: expiresAt, //cookie will be removed after the access token is expired
    });
  },
  clearToken(state) {
    state.username = null;
    state.token = null;
    state.expiresAt = null;
    Cookie.remove(COOKIE_JWT)
  }
}

const actions = {
  init(vuexContext, nuxtContext){
    if (nuxtContext.req) {
      //the server has got a request - so we have to look
      //for cookies there
      if (nuxtContext.req.cookies[COOKIE_JWT]) {
        //server
        vuexContext.commit('setToken', JSON.parse(nuxtContext.req.cookies[COOKIE_JWT]))
      }
    } else {
      //client
      vuexContext.commit('setToken', JSON.parse(Cookie.get(COOKIE_JWT)))
    }
  },
  login(vuexContext, authData) {
    let data = new URLSearchParams();
    data.append('grant_type', 'password');
    data.append('username', authData.username);
    data.append('password', authData.password);

    return this.$axios.post("/auth/token", data)
    .then(response => {
      vuexContext.commit("setToken", {
        username: authData.username,
        token: response.data.accessToken.token,
        expiresAt: new Date(response.data.accessToken.expiresAt),
      });

      return "success"
    })
    .catch(e => {
      if(e.response.status === HttpStatus.BAD_REQUEST) {
        return "invalid"
      }else {
        console.log("Error while authenticate user!", e)
        return "error"
      }
    });
  },
  logout(vuexContext) {
    vuexContext.commit("clearToken");
  }
}

const getters = {
  isAuthenticated(state) {
    return state.token != null;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
