const router = require('express').Router();
const reg_controller = require('../controllers/reg_controller');

router.get('/', reg_controller.registrationRender);
router.post('/', reg_controller.registration);

module.exports = router;