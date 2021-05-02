const Role = require('../models/Role');
const User = require('../models/User');

class mainController
{
    async users(req, res)
    {
        try
        {
            const users = await User.find()
            return res.json(users);
        }
        catch (err)
        {
            console.log(err);

        }
    }
}

module.exports = new mainController();