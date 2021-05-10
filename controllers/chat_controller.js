const mongoose = require('mongoose');
const ChatMember = require('../models/ChatMember');
const ChatMessage = require('../models/ChatMessage');
const Chat = require('../models/Chat');

const user_controller = require('./user_controller');
const { db_defaults } = require('../config');

function badResp(res, message)
{
    res.status(400).json({message: message});
}

async function getUnreadMessagesAmountFromDB(chat_id)
{
    return ChatMessage.find({
        $and:[
            {chat_id: chat_id},
            {message_status: db_defaults.message_status.unread}
        ]}).countDocuments((err, amount) => { return amount; });
}

async function deleteChatFromDB(chat_id)
{
    try
    {
        await ChatMember.deleteMany({chat_id: chat_id});
        await ChatMessage.deleteMany({chat_id: chat_id});
        await Chat.findByIdAndDelete(chat_id);
        return true;
    }
    catch
    {
        return false;
    }
}


class chat_controller
{
    async addChat(title, contactID_1, contactID_2)
    {
        const new_chat = new Chat({
            _id: new mongoose.Types.ObjectId(),
            chat_title: title,
            chat_kind: db_defaults.chat_kind.chat
        });

        let chat_members =
        [
            new ChatMember({
                _id: new mongoose.Types.ObjectId(),
                chat_id: new_chat._id,
                member_id: contactID_1
            }),
            new ChatMember({
                _id: new mongoose.Types.ObjectId(),
                chat_id: new_chat._id,
                member_id: contactID_2
            }),
        ];

        chat_members.forEach(chat_member =>
        {
            chat_member.save();
        });

        await new_chat.save();
        return new_chat._id;
    }

    async deleteChat(chat_id)
    {
        return await deleteChatFromDB(chat_id);
    }

    async getUnreadMessagesAmount(chat_id)
    {
        return await getUnreadMessagesAmountFromDB(chat_id);
    }

    async conversations(req, res)
    {
        const user_login = req.params['login'];
        if(user_login)
        {
            const user_id = await user_controller.getUserIdByLogin(user_login);

            if(user_id == null)
            {
                badResp(res, `login ${user_login} was not found`);
            }

            const conversations = await Chat.find({chat_kind: db_defaults.chat_kind.conversation});

            let conversation_IDs = [];

            for (let i = 0; i < conversations.length; i++)
            {
                conversation_IDs.push(conversations[i]._id);
            }

            const user_conv_members = await ChatMember.find({
                                                        $and:[
                                                            {chat_id: { $in: conversation_IDs } },
                                                            {member_id: user_id}
                                                        ]});

            let user_conversation_IDs = [];
            for (let i = 0; i < user_conv_members.length; i++)
            {
                user_conversation_IDs.push(user_conv_members[i].chat_id);
            }

            const user_conversations = await Chat.find({_id: { $in: user_conversation_IDs } });

            let respObj = [];

            for (let i = 0; i < user_conversations.length; i++)
            {
                respObj.push({
                    chat_id:                user_conversations[i]._id,
                    chat_title:             user_conversations[i].chat_title,
                    chat_kind:              user_conversations[i].chat_kind,
                    chat_avatar_path:       user_conversations[i].chat_avatar_path,
                    members_amount:         await ChatMember.find({chat_id: user_conversations[i]._id}).countDocuments(),
                    unread_messages_amount: await getUnreadMessagesAmountFromDB(user_conversations[i]._id)
                });
            }

            res.status(200).json(respObj);
        }
        else
        {
            badResp(res, 'login param not found');
        }
    }

    async addConv(req, res)
    {
        const { chat_title, chat_avatar_path, member_logins  } = req.body;

        if(chat_title && chat_avatar_path && member_logins)
        {
            let new_chat = new Chat({
                _id: new mongoose.Types.ObjectId(),
                chat_title: chat_title,
                chat_kind: db_defaults.chat_kind.conversation,
                chat_avatar_path: chat_avatar_path
            });

            let chat_members = [];

            for (let i = 0; i < member_logins.length; i++)
            {
                chat_members.push( new ChatMember({
                    _id: new mongoose.Types.ObjectId(),
                    chat_id: new_chat._id,
                    member_id: await user_controller.getUserIdByLogin(member_logins[i])
                }));
            }

            chat_members.forEach(chat_member =>
            {
                chat_member.save();
            });

            await new_chat.save();

            res.status(200).json({chat_id: new_chat._id});
        }
        else
        {
            badResp(res, 'body should contain: chat_title, chat_avatar_path and [member_logins]');
        }
    }

    async leaveFromConv(req, res)
    {
        const { request_login, chat_id_string } = req.body;

        if(chat_id_string && request_login)
        {
            const chat_id = mongoose.Types.ObjectId(chat_id_string);
            const member_id = await user_controller.getUserIdByLogin(request_login);

            if(member_id == null)
            {
                badResp(res, `login ${request_login} was not found`);
            }

            const found_chat_member = await ChatMember.deleteOne({
                $and:[
                    {chat_id: chat_id},
                    {member_id: member_id}
                ]});

            if(found_chat_member == null)
            {
                badResp(res, `member or chat was not found`);
            }

            await ChatMember.find({chat_id: chat_id}).countDocuments((err, amount) =>
            {
                if(amount == 0)
                {
                    deleteChatFromDB(chat_id);
                }
            });

            res.status(200).json({chat_id: chat_id});
        }
        else
        {
            badResp(res, 'body should contain: chat_id');
        }
    }
}

module.exports = new chat_controller();