const router = require('express').Router();
const main_controller = require('../controllers/main_controller');

router.get('/', main_controller.renderMainPage);

module.exports = router;