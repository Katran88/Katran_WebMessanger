const router = require('express').Router();
const user_controller = require('../controllers/user_controller');
const contact_controller = require('../controllers/contact_controller');
const chat_controller = require('../controllers/chat_controller');
const chatMessage_controller = require('../controllers/chatMessage_controller');

//User info
router.post('/:login/info',                         user_controller.getInfo);
router.post('/getUserLogin',                        user_controller.getUserLogin);
router.post('/getUserId',                           user_controller.getUserId);

//Contacts
router.post('/:login/contacts',                     contact_controller.contacts);
router.post('/:login/addContact/:contactLogin',     contact_controller.addContact);
router.post('/:login/deleteContact/:contactLogin',  contact_controller.deleteContact);
router.post('/:login/searchForNewContacts',         contact_controller.searchForNewContacts);

//Conversations
router.post('/:login/conversations',                chat_controller.conversations);
router.post('/addConv',                             chat_controller.addConv);
router.post('/leaveFromConv',                       chat_controller.leaveFromConv);

//Messages
router.post('/chat/messages',                       chatMessage_controller.messages);
router.post('/chat/addMessage',                     chatMessage_controller.addMessage);
router.post('/chat/readMessage',                    chatMessage_controller.readMessage);
router.post('/chat/countUnreadMessages',            chatMessage_controller.countUnreadMessages);


module.exports = router;