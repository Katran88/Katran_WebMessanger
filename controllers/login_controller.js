const User = require('../models/User');
const JwtHelper = require('../helpers/jwtHelper');
const PasswordHelper = require('../helpers/passwordHelper');

class loginController
{
    async login(req, res)
    {
        try
        {
            const { username, password } = req.body;
            const user = await User.findOne({username: username});
            if(!user)
            {
                return res.status(400).json({message: 'User with this name does not exist'});
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
}

module.exports = new loginController();