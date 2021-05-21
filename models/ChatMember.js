const {Schema, model} = require('mongoose');

const ChatMember = new Schema
({
    chat_id:    {type: Schema.Types.ObjectId, ref: 'Chat'},
    member_id:  {type: Schema.Types.ObjectId, ref: 'User'}
}, { versionKey: false });

module.exports = model('ChatMember', ChatMember);

