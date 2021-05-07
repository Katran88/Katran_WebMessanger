const {Schema, model} = require('mongoose');
const { db_defaults } = require('../config');

const ChatMessage = new Schema
({
    sender_id:    {type: Schema.Types.ObjectId, ref: 'User'},
    message:      {type: String, ref: 'User'},
    message_kind: {type: Number, enum: [db_defaults.message_kind.text, db_defaults.message_kind.file], required: true},
    time:         {type: Schema.Types.Date, required: true}
}, { versionKey: false });

module.exports = model('ChatMessage', ChatMessage);
