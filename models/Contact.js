const {Schema, model} = require('mongoose');

const Contact = new Schema
({
    contact_owner:      {type: Schema.Types.ObjectId, ref: 'User'},
    contact:            {type: Schema.Types.ObjectId, ref: 'User'},
    chat_id:            {type: Schema.Types.ObjectId, ref: 'Chat'}
}, { versionKey: false });

module.exports = model('Contact', Contact);
