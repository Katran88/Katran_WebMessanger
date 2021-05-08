const User = require('../models/User');
const JwtHelper = require('../helpers/jwtHelper');
const PasswordHelper = require('../helpers/passwordHelper');

class loginController
{
    async login(req, res)
    {
        try
        {
            const { login, password } = req.body;
            const user = await User.findOne({login: login});
            if(!user)
            {
                return res.status(400).json({message: 'User with this login does not exist'});
            }

            if(!PasswordHelper.compareWithHashFromDB(password, user.password))
            {
                return res.status(400).json({message: 'Invalid password'});
            }
            const token = JwtHelper.generateToken(user._id, user.role);
            res.cookie('token', token, {sameSite: 'strict'});
            res.status(200).json({message: 'Successful authorization'});

        }
        catch (err)
        {
            console.log(err);
            res.status(400).json({message: 'Login error'});
        }
    }

    async logout(req, res)
    {
        res.clearCookie('token');
        res.redirect('/login');
    }

    async loginRender(req, res)
    {
        res.clearCookie('token');

        let renderObj= { title: 'Login' };

        if(req.query.bad_token != undefined)
        {
            renderObj.message = 'You are not authorized, please, Log In first';
        }

        res.render('loginPage', renderObj);
    }
}

module.exports = new loginController();