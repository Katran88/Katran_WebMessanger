const ChatMessage = require('../models/ChatMessage');
const cryptoHelper = require('../helpers/cryptoHelper');
const user_controller = require('./user_controller');
const { db_defaults } = require('../config');

function badResp(res, message)
{
    res.status(400).json({message: message});
}

async function getUnreadMessagesAmountFromDB(chat_id, user_id)
{
    return ChatMessage.find({
        $and:[
            {chat_id: chat_id},
            {message_status: db_defaults.message_status.unread},
            {sender_id: { $ne: user_id } }
        ]}).countDocuments((err, amount) => { return amount; });
}

function convertDateToUserFormat(date)
{
    let month = (parseInt(date.getMonth()) + 1 < 10) ? '0' + (parseInt(date.getMonth()) + 1) : parseInt(date.getMonth()) + 1;
    let month_date = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();

    let hour = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
    let minute = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();

    return `${month_date}.${month} ${hour}:${minute}`;
}

class chat_controller
{
    async getUnreadMessagesAmount(chat_id, user_id)
    {
        return await getUnreadMessagesAmountFromDB(chat_id, user_id);
    }

    async messages(req, res)
    {
        const { chat_id } = req.body;
        if(chat_id)
        {
            const messages = await ChatMessage.find({chat_id: chat_id});

            let respObj = [];

            for (let i = 0; i < messages.length; i++)
            {
                let messageBody = cryptoHelper.decrypt(messages[i].message);

                const sender_login = await user_controller.getUserLoginById(messages[i].sender_id);
                const sender_avatar = JSON.parse(await user_controller.getInfoJSON(sender_login)).path_to_avatar;

                respObj.push({
                    message_id:             messages[i]._id,
                    chat_id:                messages[i].chat_id,
                    sender_id:              messages[i].sender_id,
                    sender_avatar:          sender_avatar,
                    message:                messageBody,
                    message_kind:           messages[i].message_kind,
                    message_status:         messages[i].message_status,
                    time:                   convertDateToUserFormat(messages[i].time)
                });
            }

            res.status(200).json(respObj);
        }
        else
        {
            badResp(res, 'req body should contain chat_id field');
        }
    }

    async deleteMessagesFromChat(chat_id)
    {
        try
        {
            await ChatMessage.deleteMany({chat_id: chat_id});
            return true;
        }
        catch (e)
        {
            return true;
        }
    }

    async addMessage(req, res)
    {
        let reqBody = req.body;

        if(reqBody.chat_id && reqBody.sender_id && reqBody.message && reqBody.message_kind != undefined)
        {
            let messageBody = cryptoHelper.encrypt(reqBody.message);

            let chat_message = new ChatMessage({
                chat_id: reqBody.chat_id,
                sender_id: reqBody.sender_id,
                message: messageBody,
                message_kind: reqBody.message_kind,
                message_status: db_defaults.message_status.unread
            });
            await chat_message.save();

            const sender_login = await user_controller.getUserLoginById(chat_message.sender_id);
            const sender_avatar = JSON.parse(await user_controller.getInfoJSON(sender_login)).path_to_avatar;

            let respObj =
            {
                message_id:             chat_message._id,
                chat_id:                chat_message.chat_id,
                sender_id:              chat_message.sender_id,
                sender_avatar:          sender_avatar,
                message:                reqBody.message,
                message_kind:           chat_message.message_kind,
                message_status:         chat_message.message_status,
                time:                   convertDateToUserFormat(chat_message.time)
            };

            res.status(200).json(respObj);
        }
        else
        {
            badResp(res, 'req body should contain chat_id field');
        }
    }

    async readMessage(req, res)
    {
        let { message_id } = req.body;

        if(message_id)
        {
            await ChatMessage.updateOne( {_id: message_id},
                                       {message_status: db_defaults.message_status.read});

            res.status(200).json(
            {
                message_id: message_id,
                message_status: db_defaults.message_status.read
            });
        }
        else
        {
            badResp(res, 'req body should contain message_id field');
        }
    }

    async countUnreadMessages(req, res)
    {
        let { chat_id } = req.body;
        let user_id = await user_controller.getUserIdFromCookie(req.cookies);

        if(chat_id)
        {
            const amount = await getUnreadMessagesAmountFromDB(chat_id, user_id);
            res.status(200).json(
            {
                chat_id: chat_id,
                unread_messages_amount: amount
            });
        }
        else
        {
            badResp(res, 'req body should contain message_id field');
        }
    }
}

module.exports = new chat_controller();