const router = require('express').Router();
const main_controller = require('../controllers/admin_controller');

router.get('/', main_controller.renderAccessManagementPage);

module.exports = router;