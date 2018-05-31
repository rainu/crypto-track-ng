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

const TransactionSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  involvedWallets: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'wallet'
    }],
  },
  involvedCurrencies: {
    type: [currency],
  },
  type: {
    type: String,
  },
  date: {
    type: Date,
  },
  data: {
    type: Object
  },
  description: {
    type: String
  }
});

module.exports = mongoose.model('transaction', TransactionSchema);
