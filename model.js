const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    name: String,
    facebookID: String,
    accessToken: String
}, {collection: 'users'})

const model = mongoose.model('users', Schema)
module.exports = model;
