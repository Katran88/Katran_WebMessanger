const router = require('express').Router();
const { check } = require('express-validator');
const reg_controller = require('../controllers/reg_controller');

router.get('/', reg_controller.registrationRender);
router.post('/',
[
    check('login', 'Login should contain from 2 to 20 characters').isLength({min:2, max:20}),
    check('password', 'Password should contain from 5 characters').isLength({min:5}),
], reg_controller.registration);

module.exports = router;