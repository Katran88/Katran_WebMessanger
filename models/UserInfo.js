const {Schema, model} = require('mongoose');
const { db_defaults, default_avatar_path } = require('../config');

const UserInfo = new Schema
({
    user_id:            {type: Schema.Types.ObjectId, ref: 'User'},
    username:           {type: String, required: true},
    path_to_avatar:     {type: String, default: default_avatar_path},
    status:             {type: Number, default: db_defaults.status.offline, enum: [db_defaults.status.offline, db_defaults.status.online]},
    is_blocked:         {type: Boolean, default: false}
}, { versionKey: false });

module.exports = model('UserInfo', UserInfo);