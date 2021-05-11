const router = require('express').Router();
const user_controller = require('../controllers/user_controller');
const contact_controller = require('../controllers/contact_controller');
const chat_controller = require('../controllers/chat_controller');

router.post('/:login/info',                         user_controller.getInfo);
router.post('/getUserLogin',                        user_controller.getUserLogin);

router.post('/:login/contacts',                     contact_controller.contacts);
router.post('/:login/addContact/:contactLogin',     contact_controller.addContact);
router.post('/:login/deleteContact/:contactLogin',  contact_controller.deleteContact);
router.post('/:login/searchForNewContacts',         contact_controller.searchForNewContacts);

router.post('/:login/conversations',                chat_controller.conversations);
router.post('/addConv',                             chat_controller.addConv);
router.post('/leaveFromConv',                       chat_controller.leaveFromConv);

module.exports = router;