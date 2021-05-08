const PasswordHelper = require('../helpers/passwordHelper');
const JwtHelper = require('../helpers/jwtHelper');
const User = require('../models/User');
const { db_defaults } = require('../config');

class regController
{
    async registration(req, res)
    {
        try
        {
            const {login, password} = req.body;
            const candidate = await User.findOne({login: login});
            if(candidate)
            {
                return res.status(400).json({message: 'User with this login is already registered'});
            }

            const hashedPassword = PasswordHelper.generateHash(password);

            const user = new User({login: login, password: hashedPassword, role: db_defaults.role.user});
            await user.save();

            const token = JwtHelper.generateToken(user._id, user.role);
            res.cookie('token', token, {sameSite: 'strict'});
            return res.status(200).json({message: 'Successful registration'});
        }
        catch (err)
        {
            console.log(err);
            res.status(400).json({message: 'Registration error'});
        }
    }

    async registrationRender(req, res)
    {
        res.clearCookie('token');
        res.render('registrationPage',
        {
            title: 'Registration'
        });
    }
}

module.exports = new regController();