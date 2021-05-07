const {Schema, model} = require('mongoose');
const { db_defaults } = require('../config');

const User = new Schema
({
    login:      {type: String, unique: true, required: true},
    password:   {type: String, required: true},
    role:       {type: Number, default: db_defaults.role.user, enum: [db_defaults.role.user, db_defaults.role.admin]}
}, { versionKey: false });

module.exports = model('User', User);