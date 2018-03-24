const router = require('express').Router();
const HttpStatus = require('http-status-codes');
const OAuthServer = require('oauth2-server');
const OAuthAccessToken = require('../../../common/db/model/oauth2/access_token')
const OAuthRefreshToken = require('../../../common/db/model/oauth2/refresh_token')
const OAuthUser = require('../../../common/db/model/oauth2/user')
const oauth = require('../oauth2');
const Config = require('../../../common/config')
const Log = require('../../../common/log')
const bcrypt = require('bcrypt');
const Request = OAuthServer.Request;
const Response = OAuthServer.Response;

const oauthRequest = (req) => {
  const clientId = Config.oauth2.client.id
  const clientSecret = Config.oauth2.client.secret

  //the user (browser) will never send the clientId/clientSecret only the server knows these credentials
  //so here we add them manually to the original request
  const b64Credits = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  req.headers['Authorization'] = `Basic ${b64Credits}`;

  return new Request(req)
}

router.route('/auth/token').post((req, res) => {
  let request = oauthRequest(req);
  let response = new Response(res);

  oauth.token(request,response)
  .then(token => {
    return res.json({
      accessToken: {
        token: token.accessToken,
        expiresAt: token.accessTokenExpiresAt
      },
      refreshToken: {
        token: token.refreshToken,
        expiresAt: token.refreshTokenExpiresAt
      },
    })
  }).catch(err => {
    Log.error("Error while request oauth2-token!", err)
    return res.status(err.code || HttpStatus.INTERNAL_SERVER_ERROR).json(err)
  })
});

router.route('/auth/logout').post((req, res) => {
  oauth.authenticate(new Request(req), new Response(res), {})
  .then(token => {
    Promise.all([
      OAuthRefreshToken.remove({
        $or:[ {'OAuthClient': token.OAuthClient._id}, {'User': token.User._id} ]
      }),
      OAuthAccessToken.remove({
        $or:[ {'OAuthClient': token.OAuthClient._id}, {'User': token.User._id} ]
      }),
    ]).then(() => {
      res.status(HttpStatus.OK);
      res.end();
    }).catch(err => {
      Log.error(`Could not remove access/refresh-token for user '${token.User.username}'`, err)
      res.status(err.code || HttpStatus.INTERNAL_SERVER_ERROR).json(err)
    })
  }).catch(err => {
    Log.error(`Could not authenticate access-token!`, err)
    return res.status(err.code || HttpStatus.INTERNAL_SERVER_ERROR).json(err)
  })
});

router.route('/auth/register').post((req, res) => {
  OAuthUser.count({username: req.body.username}).then(userCount => {
    if(userCount >= 1) {
      // a user with this name is already exists
      res.status(HttpStatus.CONFLICT).json({
        message: "Username already exists!"
      })
      return
    }

    //the request contains plain password
    //but we always store password bcrypted!
    bcrypt.genSalt(13, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function (err, hash) {
        if (err) {
          //bcrypt failed
          Log.error("Could not bcrypt user password!", err)
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: err
          })
          return
        }

        //save new user
        new OAuthUser({
          username: req.body.username,
          password: hash,
        }).save().then(user => {
          Log.info("Register a new user: " + user)
          res.status(HttpStatus.CREATED)
          res.end()
        }).catch(err => {
          Log.error("Could not save user!", err)
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: err
          })
        })
      });
    })
  })
});

module.exports = router
