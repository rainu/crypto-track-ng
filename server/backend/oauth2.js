const OAuthServer = require('oauth2-server');
const bcrypt = require('bcrypt')
const Log = require('../../common/log')
const User = require('../../common/db/model/oauth2/user')
const OAuthClient = require('../../common/db/model/oauth2/client')
const OAuthAccessToken = require('../../common/db/model/oauth2/access_token')
const OAuthAuthorizationCode = require('../../common/db/model/oauth2/authorization_code')
const OAuthRefreshToken = require('../../common/db/model/oauth2/refresh_token')

function getAccessToken(bearerToken) {
  Log.debug("[OAUTH2] getAccessToken: %o", bearerToken)

  return OAuthAccessToken.findOne({
    access_token: bearerToken
  })
  .populate('User')
  .populate('OAuthClient').then(accessToken => {
    if (!accessToken) {
      return false;
    }

    let token = accessToken;
    token.user = token.User;
    token.client = token.OAuthClient;
    token.accessTokenExpiresAt = token.expires;
    token.scope = token.scope
    return token;
  })
  .catch(err => {
    Log.error("[OAUTH2] getAccessToken - Err: %o", err)
  });
}

function getClient(clientId, clientSecret) {
  Log.debug("[OAUTH2] getClient: \n\t%o\n\t%o", clientId, clientSecret)

  const options = {client_id: clientId};
  if (clientSecret) {
    options.client_secret = clientSecret;
  }

  return OAuthClient.findOne(options)
  .then(client => {
    if (!client) {
      return new Error("client not found");
    }

    return client
  }).catch(err => {
    Log.error("[OAUTH2] getClient - Err: %o", err)
  });
}

function getUser(username, password) {
  Log.debug("[OAUTH2] getUser:\n\t%o\n\t%o", username, password)

  return User.findOne({username: username})
  .then(user => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password).then(passwordMatch => {
        if(passwordMatch) {
          resolve(user)
        }else{
          reject()
        }
      }).catch(err => {
        Log.error("Error while compare bcrypt hashes!", err)
        reject(err)
      })
    })
  })
  .catch(err => {
    Log.error("[OAUTH2] getUser - Err: ", err)
  });
}

function revokeAuthorizationCode(code) {
  Log.debug("[OAUTH2] revokeAuthorizationCode: %o", code)

  return OAuthAuthorizationCode.remove({
    authorization_code: code.code
  }).then(() => {
    return true;
  }).catch(err => {
    Log.error("[OAUTH2] getUser - Err: %o", err)
    return false;
  });
}

function revokeToken(token) {
  Log.debug("[OAUTH2] revokeToken: %o", token)

  return OAuthRefreshToken.remove({
    refresh_token: token.refreshToken
  }).then(() => {
    return true;
  }).catch(err => {
    Log.error("[OAUTH2] revokeToken - Err: %o", err)
    return false;
  });
}

function saveToken(token, client, user) {
  Log.debug("[OAUTH2] saveToken:\n\ttoken: %o\n\tclient: %o\n\tuser: %o", token, client, user)

  return Promise.all([
    OAuthAccessToken.create({
      access_token: token.accessToken,
      expires: token.accessTokenExpiresAt,
      OAuthClient: client._id,
      User: user._id,
      scope: token.scope
    }),
    token.refreshToken ? OAuthRefreshToken.create({ // no refresh token for client_credentials
      refresh_token: token.refreshToken,
      expires: token.refreshTokenExpiresAt,
      OAuthClient: client._id,
      User: user._id,
      scope: token.scope
    }) : [],

  ])
  .then(() => {
    return Object.assign(  // expected to return client and user, but not returning
      {
        client: client,
        user: user,
        access_token: token.accessToken, // proxy
        refresh_token: token.refreshToken, // proxy
      },
      token
    )
  })
  .catch(err => {
    Log.error("[OAUTH2] revokeToken - Err: %o", err)
  });
}

function getAuthorizationCode(code) {
  Log.debug("[OAUTH2] getAuthorizationCode: %o", code)

  return OAuthAuthorizationCode.findOne({
    authorization_code: code
  })
  .populate('User')
  .populate('OAuthClient').then(authCodeModel => {
    if (!authCodeModel) {
      return false;
    }

    let client = authCodeModel.OAuthClient
    let user = authCodeModel.User

    return reCode = {
      code: code,
      client: client,
      expiresAt: authCodeModel.expires,
      redirectUri: client.redirect_uri,
      user: user,
      scope: authCodeModel.scope,
    };
  }).catch(err => {
    Log.error("[OAUTH2] getAuthorizationCode - Err: %o", err)
  });
}

function saveAuthorizationCode(code, client, user) {
  Log.debug("[OAUTH2] saveAuthorizationCode:\n\t%o\n\t%o\n\t%o", code, client, user)

  return OAuthAuthorizationCode.create({
    expires: code.expiresAt,
    OAuthClient: client._id,
    authorization_code: code.authorizationCode,
    User: user._id,
    scope: code.scope
  })
  .then(() => {
    code.code = code.authorizationCode
    return code
  }).catch(err => {
    Log.error("[OAUTH2] saveAuthorizationCode - Err: %o", err)
  });
}

function getUserFromClient(client) {
  Log.debug("[OAUTH2] getUserFromClient: %o", client)

  let options = {client_id: client.client_id};
  if (client.client_secret) {
    options.client_secret = client.client_secret;
  }

  return OAuthClient.findOne(options)
  .populate('User')
  .then(client => {
    if (!client || !client.User) {
      return false;
    }
    return client.User;
  }).catch(err => {
    Log.error("[OAUTH2] getUserFromClient - Err: %o", err)
  });
}

function getRefreshToken(refreshToken) {
  Log.debug("[OAUTH2] getRefreshToken: %o", refreshToken)
  if (!refreshToken || refreshToken === 'undefined') {
    return false
  }
//[OAuthClient, User]
  return OAuthRefreshToken.findOne({refresh_token: refreshToken})
  .populate('User')
  .populate('OAuthClient')
  .then(savedRT => {
    return {
      user: savedRT ? savedRT.User : {},
      client: savedRT ? savedRT.OAuthClient : {},
      refreshTokenExpiresAt: savedRT ? new Date(savedRT.expires) : null,
      refreshToken: refreshToken,
      refresh_token: refreshToken,
      scope: savedRT ? savedRT.scope : ''
    }
  }).catch(err => {
    Log.error("[OAUTH2] getRefreshToken - Err: %o", err)
  });
}

function verifyScope(token, scope) {
  Log.debug("[OAUTH2] verifyScope:\n\t%o\n\t%o", token, scope)

  return token.scope === scope
}

// https://github.com/manjeshpv/node-oauth2-server-implementation/blob/master/components/oauth/models.js
const oauth = new OAuthServer({
  model: {
    getAccessToken,
    getAuthorizationCode,
    getClient,
    getRefreshToken,
    getUser,
    getUserFromClient,
    revokeAuthorizationCode,
    revokeToken,
    saveToken,
    saveAuthorizationCode,
    verifyScope,
  }
});

module.exports = oauth
