const router = require('express').Router();
const main_controller = require('../controllers/main_controller');

router.get('/');
router.get('/users', main_controller.users);

module.exports = router;