'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
});

module.exports = mongoose.model('User', UserSchema);
