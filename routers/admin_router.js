const router = require('express').Router();
const main_controller = require('../controllers/admin_controller');

router.get('/',                      main_controller.renderAccessManagementPage);
router.post('/getAllUsersInfo',      main_controller.getAllUsersInfo);
router.post('/manageUserAccess',     main_controller.manageUserAccess);

module.exports = router;