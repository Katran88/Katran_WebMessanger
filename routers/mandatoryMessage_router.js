const router = require('express').Router();
const mandatoryMessage_controller = require('../controllers/mandatoryMessage_controller');

router.get('/', mandatoryMessage_controller.renderMandatoryMessagePage);

module.exports = router;