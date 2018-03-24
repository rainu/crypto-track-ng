const OAuthServer = require('oauth2-server');
const HttpStatus = require('http-status-codes');
const Log = require('../../../common/log')
const Request = OAuthServer.Request;
const Response = OAuthServer.Response;

const oauth = require('../oauth2')

/*
  This middleware is responsible for protect /api/-endpoints for unauthorized
  access. Only registered and logged in users are authorized these endpoints.
  Here we use the oauth2-lib and leave the decision to her.
 */

module.exports = (req, res, next) => {
  //only protect api-endpoint
  if(!req.url.startsWith('/api/')){
    Log.debug("[AUTH-MIDDLEWARE] Request a non secure resource. Nothing to do.")
    next()
    return
  }

  let request = new Request({
    headers: {authorization: req.headers.authorization},
    method: req.method,
    query: req.query,
    body: req.body
  });
  const response = new Response(res);

  oauth.authenticate(request, response, {}).then(function (token) {
    Log.debug("[AUTH-MIDDLEWARE] Request a secure resource. Request is authorized.")

    // Request is authorized.
    req.user = token
    next()
  }).catch(function (err) {
    // Request is not authorized.
    Log.debug("[AUTH-MIDDLEWARE] Request a secure resource. Request is not authorized.")

    res.status(err.code || HttpStatus.INTERNAL_SERVER_ERROR).json(err)
  });
};
