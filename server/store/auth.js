import Cookie from "js-cookie";
import HttpStatus from 'http-status-codes';

const COOKIE_JWT = "JWT"

const state = () => ({
  username: null,
  token: null,
  refreshToken: null,
  expiresAt: null,
})

const mutations = {
  setToken(state, {username, token, refreshToken, expiresAt}) {
    state.username = username;
    state.token = token;
    state.refreshToken = refreshToken;
    state.expiresAt = expiresAt;

    Cookie.set(COOKIE_JWT, JSON.stringify({
      username, token, expiresAt, refreshToken
    }), {
      expires: expiresAt, //cookie will be removed after the access token is expired
    });
  },
  clearToken(state) {
    state.username = null;
    state.token = null;
    state.refreshToken = null;
    state.expiresAt = null;
    Cookie.remove(COOKIE_JWT)
  }
}

const actions = {
  init(vuexContext){
    return new Promise((resolve, reject) => {
      const rawJWT = Cookie.get(COOKIE_JWT)

      if (rawJWT) {
        let jwt = JSON.parse(rawJWT, (key, value) => {
          if(key === 'expiresAt') return new Date(value)
          return value
        })
        this.$axios.setToken(jwt.token, "Bearer")

        vuexContext.commit('setToken', jwt)
      }

      resolve()
    })
  },
  login(vuexContext, authData) {
    let data = new URLSearchParams();
    data.append('grant_type', 'password');
    data.append('username', authData.username);
    data.append('password', authData.password);

    return this.$axios.post("/auth/token", data)
    .then(response => {
      this.$axios.setToken(response.data.accessToken.token, "Bearer")

      vuexContext.commit("setToken", {
        username: authData.username,
        token: response.data.accessToken.token,
        refreshToken: response.data.refreshToken.token,
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
  refresh(vuexContext) {
    let data = new URLSearchParams();
    data.append('grant_type', 'refresh_token');
    data.append('refresh_token', vuexContext.state.refreshToken);

    return this.$axios.post("/auth/token", data)
    .then(response => {
      this.$axios.setToken(response.data.accessToken.token, "Bearer")

      vuexContext.commit("setToken", {
        username: vuexContext.state.username,
        token: response.data.accessToken.token,
        refreshToken: response.data.refreshToken.token,
        expiresAt: new Date(response.data.accessToken.expiresAt),
      });

      return "success"
    })
    .catch(e => {
      if(e.response.status === HttpStatus.BAD_REQUEST) {
        return "invalid"
      } else {
        console.log("Error while authenticate user!", e)
        return "error"
      }
    });
  },
  logout(vuexContext) {
    this.$axios.setToken(false)

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
