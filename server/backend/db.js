const mongodb = require('../../common/db/setup');
const Log = require('../../common/log')
const Config = require('../../common/config')
const bcrypt = require('bcrypt')
const OAuthClient = require('../../common/db/model/oauth2/client')
const OAuthUser = require('../../common/db/model/oauth2/user')

/*
  We have to make sure that this application works even if the database is empty.
  So here we will store some initial database entries. Such like the user and
  the oauth2-client.
 */

OAuthClient.count({client_id: Config.oauth2.client.id}).then(count => {
  if(count === 0) {
    Log.info("Create new oauth2 client...")

    new OAuthClient({
      client_id: Config.oauth2.client.id,
      client_secret: Config.oauth2.client.secret,
      grants: ['authorization_code', 'password', 'refresh_token', 'client_credentials'],
      redirectUris: ["http://localhost:3000/"],
    }).save().then(client => {
      Log.debug("OAuth2Client saved: %o", client)
    }).catch(err => {
      Log.error("Could not save OAuth2Client!", err)
      process.exit(1)
    })
  } else {
    Log.debug('Oauth2Cient already stored.')
  }
}).catch(err => {
  Log.error("Could not determine if there is at least one oauth2 client!", err)
})

OAuthUser.count({username: Config.oauth2.user.name}).then(count => {
  if(count === 0) {
    Log.info("Create new oauth2 user...")

    let password = Config.oauth2.user.password
    if(!password.startsWith("$2a$")) {
      bcrypt.genSalt(13, function(err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          if (err) {
            Log.error("Could not generate bcrypt hash of oauth2 user!", err)
            process.exit(1)
          }

          //save new user
          new OAuthUser({
            username: Config.oauth2.user.name,
            password: hash,
          }).save().then(user => {
            Log.debug("OAuth2User saved: %o", user)
          }).catch(err => {
            Log.error("Could not save OAuth2User!", err)
            process.exit(1)
          })
        });
      });
    } else {
      //save new user
      new OAuthUser({
        username: Config.oauth2.user.name,
        password: Config.oauth2.user.password,
      }).save().then(user => {
        Log.debug("OAuth2User saved: %o", user)
      }).catch(err => {
        Log.error("Could not save OAuth2User!", err)
        process.exit(1)
      })
    }
  } else {
    Log.debug('Oauth2User already stored.')
  }
}).catch(err => {
  Log.error("Could not determine if there is at least one oauth2 user!", err)
})

module.exports = mongodb
