"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const currency = mongoose.Schema({
  name: {
    type: String
  },
  type: {
    type: String
  }
},{ _id : false });

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
  currencies: {
    type: [currency]
  },
  description: {
    type: String,
  }
});

module.exports = mongoose.model('wallet', WalletSchema);
