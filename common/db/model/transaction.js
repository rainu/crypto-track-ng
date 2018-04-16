"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
