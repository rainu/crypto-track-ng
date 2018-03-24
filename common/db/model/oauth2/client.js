'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OAuthClientSchema = new Schema({
  name: String,
  client_id: String,
  client_secret: String,
  redirectUris: { type: Array },
  grants: { type: Array },
  User: {type: Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('OAuthClient', OAuthClientSchema);
