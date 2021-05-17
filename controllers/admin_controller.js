const User = require('../models/User');
const UserInfo = require('../models/UserInfo');
const JwtHelper = require('../helpers/jwtHelper');

function badResp(res, message)
{
    res.status(400).json({message: message});
}

class admin_controller
{
    async renderAccessManagementPage(req, res)
    {
       res.render('accessManagementPage',
       {
           title: 'Access Management'
       });
    }

    async getAllUsersInfo(req, res)
    {
        const decodedTokenData = JwtHelper.verifyAndParseToken(req.cookies.token);

        if(decodedTokenData && decodedTokenData.id)
        {
            let users_info = await UserInfo.find({user_id: { $ne: decodedTokenData.id } });
            let respObj = [];
            for (let i = 0; i < users_info.length; i++)
            {
                respObj.push(
                {
                    user_id: users_info[i].user_id,
                    username: users_info[i].username,
                    path_to_avatar: users_info[i].path_to_avatar,
                    is_blocked: users_info[i].is_blocked
                });
            }
            res.status(200).json(respObj);
        }
        else
        {
            badResp(res, 'can\'t take id');
        }
    }

    async manageUserAccess(req, res)
    {
        const {user_id, block_unblockFlag} = req.body;
        if(user_id && block_unblockFlag != undefined)
        {
            await UserInfo.updateOne({user_id: user_id }, {is_blocked: block_unblockFlag});

            res.status(200).json({user_id: user_id, is_blocked: block_unblockFlag});
        }
        else
        {
            badResp(res, 'can\'t take id');
        }
    }
}

module.exports = new admin_controller();