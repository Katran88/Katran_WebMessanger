const {Schema, model} = require('mongoose');
const { db_defaults } = require('../config');

const ChatMessage = new Schema
({
    chat_id:        {type: Schema.Types.ObjectId, ref: 'Chat'},
    sender_id:      {type: Schema.Types.ObjectId, ref: 'User'},
    message:        {type: String, required: true},
    message_kind:   {type: Number, enum: [db_defaults.message_kind.text, db_defaults.message_kind.file], required: true},
    message_status: {type: Number, enum: [db_defaults.message_status.unread, db_defaults.message_status.read], required: true},
    time:           {type: Schema.Types.Date, default: Date.now()}
}, { versionKey: false });

module.exports = model('ChatMessage', ChatMessage);

