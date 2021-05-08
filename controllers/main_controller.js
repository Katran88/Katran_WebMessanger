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

    async renderPage(req, res)
    {
        res.render('mainPage',
        {
            title: 'Katran Messenger'
        });
    }
}

module.exports = new mainController();