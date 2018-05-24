"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FiatHistoricalSchema = new Schema({
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  date: {
    type: Date,
  },
  open: {
    type: Number,
  },
  high: {
    type: Number,
  },
  low: {
    type: Number,
  },
  close: {
    type: Number,
  }
});

FiatHistoricalSchema.index({ from: 1, to: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('course_fiat_historical', FiatHistoricalSchema);
