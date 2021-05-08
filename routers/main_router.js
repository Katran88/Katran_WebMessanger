const router = require('express').Router();
const main_controller = require('../controllers/main_controller');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', main_controller.renderPage);
router.get('/users', [roleMiddleware(['admin'])], main_controller.users);

module.exports = router;