const { validationResult } = require('express-validator');
const PasswordHelper = require('../helpers/passwordHelper');
const Role = require('../models/Role');
const User = require('../models/User');

class regController
{
    async registration(req, res)
    {
        try
        {
            const errors = validationResult(req)
            if(!errors.isEmpty())
            {
                return res.status(400).json({message: 'Validation error on registration', errors});
            }

            const {username, password} = req.body;
            const candidate = await User.findOne({username});
            if(candidate)
            {
                return res.status(400).json({message: 'This username is already registered'});
            }

            const hashedPassword = PasswordHelper.generateHash(password);

            const user = new User({username, password: hashedPassword, role: 'user'});
            await user.save();

            return res.json({message: 'Successful registration'});
        }
        catch (err)
        {
            console.log(err);
            res.status(400).json({message: 'Registration error'});
        }
    }
}

module.exports = new regController();