const {Schema, model} = require('mongoose');
const { db_defaults } = require('../config');
const ChatMessage = require('./ChatMessage');

const Chat = new Schema
({
    chat_title:         {type: String, unique: true, required: true},
    chat_kind:          {type: Number, required: true, enum: [db_defaults.chat_kind.chat, db_defaults.chat_kind.conversation], default: db_defaults.chat_kind.chat},
    chat_avatar_path:   {type: String, default: ''},
    messages:           [ChatMessage]
}, { versionKey: false });

module.exports = model('Chat', Chat);
