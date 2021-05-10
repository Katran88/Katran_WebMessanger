const User = require('../models/User');
const UserInfo = require('../models/UserInfo');
const JwtHelper = require('../helpers/jwtHelper');
const { db_defaults } = require('../config');

class mainController
{
    async renderMainPage(req, res)
    {
        const { id } = JwtHelper.verifyAndParseToken(req.cookies.token);
        const user = await User.findById(id);
        const user_info = await UserInfo.findOne({user_id: id});

        let renderObj=
        {
            title: 'Katran Messenger',
            profileAvatar: user_info.path_to_avatar,
            admin: user.role ==  db_defaults.role.admin
        };
        res.render('mainPage', renderObj);
    }

    
}

module.exports = new mainController();