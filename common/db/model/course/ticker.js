"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const currency = mongoose.Schema({
  symbol: {
    type: String
  },
  type: {
    type: String
  }
},{ _id : false });

const CourseTickerSchema = new Schema({
  currency: {
    type: currency,
  },
  last_update: {
    type: Date,
  },
  rank: {
    type: Number,
  },
  price: {
    amount: {
      type: Number,
    },
    currency: {
      type: currency,
    }
  },
  change: {
    hour: {
      type: Number,
    },
    day: {
      type: Number,
    },
    week: {
      type: Number,
    },
  }
});

CourseTickerSchema.index({ currency: 1, "price.currency": 1 }, { unique: true });

module.exports = mongoose.model('course_ticker', CourseTickerSchema);
