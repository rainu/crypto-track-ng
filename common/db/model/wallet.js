"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  address: {
    type: String,
  },
  name: {
    type: String,
  },
  types: {
    type: [String]
  },
  description: {
    type: String,
  }
});

module.exports = mongoose.model('wallet', WalletSchema);
