const Contact = require('../models/Contact');
const UserInfo = require('../models/UserInfo');

const { db_defaults } = require('../config');
const user_controller = require('./user_controller');
const chatMessage_controller = require('./chatMessage_controller');
const chat_controller = require('./chat_controller');

function badResp(res, message)
{
    res.status(400).json({message: message});
}

async function getContactRecords(contactID_1, contactID_2)
{
    const contacts = await Contact.find({
        $or:[
            {$and: [
                    {contact_owner: contactID_1},
                    {contact:       contactID_2}
                ]},
            {$and: [
                    {contact_owner: contactID_2},
                    {contact:       contactID_1}
                ]}
        ]
    });

    return contacts;
}

class contact_controller
{
    async contacts(req, res)
    {
        const user_login = req.params['login'];
        if(user_login)
        {
            const user_id = await user_controller.getUserIdByLogin(user_login);

            if(user_id == null)
            {
                badResp(res, `have not found such login: ${user_login}`);
            }

            const contacts = await Contact.find({contact_owner: user_id}, 'contact chat_id');

            let respObj = [];

            for (let i = 0; i < contacts.length; i++)
            {
                let contactLogin = await user_controller.getUserLoginById(contacts[i].contact);
                let contactInfo = JSON.parse(await user_controller.getInfoJSON(contactLogin));

                respObj.push({
                    contact: contacts[i].contact,
                    login: contactLogin,
                    chat_id: contacts[i].chat_id,
                    username: contactInfo.username,
                    path_to_avatar: contactInfo.path_to_avatar,
                    status: contactInfo.status,
                    is_blocked: contactInfo.is_blocked,
                    unread_messages_amount: await chatMessage_controller.getUnreadMessagesAmount(contacts[i].chat_id, user_id)
                });
            }

            res.status(200).json(respObj);
        }
        else
        {
            badResp(res, 'login param not found');
        }
    }

    async addContact(req, res)
    {
        const user_login = req.params['login'];
        if(user_login)
        {
            const contact_login = req.params['contactLogin'];

            if(contact_login)
            {
                const contact_ownerId = await user_controller.getUserIdByLogin(user_login);
                const contactId = await user_controller.getUserIdByLogin(contact_login);

                if(contact_ownerId == null || contactId  == null)
                {
                    badResp(res, 'have not found such logins');
                }

                const contacts = await getContactRecords(contact_ownerId, contactId);

                if(contacts.length <= 0)
                {
                    let chat_title = user_login + '_' + contact_login;
                    const chat_id = await chat_controller.addChat(chat_title, contact_ownerId, contactId);
                    if(chat_id)
                    {
                        let contact_1 = new Contact({
                            contact_owner: contact_ownerId,
                            contact: contactId,
                            chat_id: chat_id
                        });
                        await contact_1.save();

                        let contact_2 = new Contact({
                            contact_owner: contactId,
                            contact: contact_ownerId,
                            chat_id: chat_id
                        });
                        await contact_2.save();

                        res.status(200).json({chat_id: chat_id});
                    }
                    else
                    {
                        badResp(res, 'chat creation failed');
                    }
                }
                else
                {
                    badResp(res, 'contact is already here');
                }
            }
            else
            {
                badResp(res, 'contactLogin param not found');
            }
        }
        else
        {
            badResp(res, 'login param not found');
        }
    }

    async deleteContact(req, res)
    {
        const user_login = req.params['login'];
        if(user_login)
        {
            const contact_login = req.params['contactLogin'];

            if(contact_login)
            {
                const contact_ownerId = await user_controller.getUserIdByLogin(user_login);
                const contactId = await user_controller.getUserIdByLogin(contact_login);

                if(contact_ownerId == null || contactId  == null)
                {
                    badResp(res, 'have not found such logins');
                }

                const contacts = await getContactRecords(contact_ownerId, contactId);

                if(contacts.length > 0)
                {
                    const chat_id = contacts[0].chat_id;
                    await chat_controller.deleteChat(chat_id);
                    await Contact.deleteMany({chat_id: chat_id});
                    res.status(200).json({chat_id: chat_id});
                }
                else
                {
                    badResp(res, 'contacts not found')
                }
            }
            else
            {
                badResp(res, 'contactLogin param not found');
            }
        }
        else
        {
            badResp(res, 'login param not found');
        }
    }

    async searchForNewContacts(req, res)
    {
        const user_login = req.params['login'];
        if(user_login)
        {
            const { search_username } = req.body;
            const owner_id = await user_controller.getUserIdByLogin(user_login);

            if(owner_id == null || !search_username)
            {
                badResp(res, 'have not found such logins');
            }

            const contacts = await Contact.find({contact_owner: owner_id}, 'contact');

            const contactIds = [];
            for (let i = 0; i < contacts.length; i++)
            {
                contactIds.push(contacts[i].contact);
            }
            contactIds.push(owner_id);
            const notContacts = await UserInfo.find({user_id: { $nin: contactIds } });

            const respObj = [];
            for (let i = 0; i < notContacts.length; i++)
            {
                if(notContacts[i].username.toLowerCase().indexOf(search_username.toLowerCase()) >= 0)
                {
                    respObj.push(
                    {
                        login: await user_controller.getUserLoginById(notContacts[i].user_id),
                        user_id: notContacts[i].user_id,
                        username: notContacts[i].username,
                        path_to_avatar: notContacts[i].path_to_avatar,
                        status: notContacts[i].status,
                        is_blocked: notContacts[i].is_blocked
                    });
                }
            }

            res.status(200).json(respObj);
        }
        else
        {
            badResp(res, 'login param not found');
        }
    }

}

module.exports = new contact_controller();