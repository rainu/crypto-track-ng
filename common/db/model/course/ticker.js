"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseTickerSchema = new Schema({
  symbol: {
    type: String,
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
      type: String,
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

CourseTickerSchema.index({ symbol: 1, "price.currency": 1 }, { unique: true });

module.exports = mongoose.model('course_ticker', CourseTickerSchema);
