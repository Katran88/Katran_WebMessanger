const User = require('../models/User');
const UserInfo = require('../models/UserInfo');

const JwtHelper = require('../helpers/jwtHelper');

function badResp(res, message)
{
    res.status(400).json({message: message});
}

async function getUserInfoFromDBbyLogin(login)
{
    const user = await User.findOne({login: login});
    if(user)
    {
        let retInfo = {};
        retInfo.login = user.login;

        const userinfo = await UserInfo.findOne({user_id: user.id});
        retInfo.username = userinfo.username;
        retInfo.path_to_avatar = userinfo.path_to_avatar;
        retInfo.status = userinfo.status;
        retInfo.is_blocked = userinfo.is_blocked;

        return retInfo;
    }
    else
    {
        return {message: 'user not found'};
    }
}

class user_controller
{
    async getInfo(req, res)
    {
        const user_login = req.params['login'];
        if(user_login)
        {
            const user_info = await getUserInfoFromDBbyLogin(user_login);
            res.status(200).json(user_info);
        }
        else
        {
            badResp(res, 'login param not found');
        }
    }

    async getInfoJSON(login)
    {
        return JSON.stringify( await getUserInfoFromDBbyLogin(login) );
    }

    async getUserLogin(req, res)
    {
        const decodedTokenData = JwtHelper.verifyAndParseToken(req.cookies.token);

        const user = await User.findById(decodedTokenData.id);

        if(user)
        {
            res.status(200).json({login: user.login});
        }
        else
        {
            badResp(res, 'user login not found');
        }
    }

    async getUserId(req, res)
    {
        const decodedTokenData = JwtHelper.verifyAndParseToken(req.cookies.token);

        if(decodedTokenData && decodedTokenData.id)
        {
            res.status(200).json({id: decodedTokenData.id});
        }
        else
        {
            badResp(res, 'can\'t take id');
        }
    }

    async getUserIdFromCookie(cookies)
    {
        const decodedTokenData = JwtHelper.verifyAndParseToken(cookies.token);

        if(decodedTokenData && decodedTokenData.id)
        {
            return decodedTokenData.id;
        }
        else
        {
            return null;
        }
    }


    async getUserIdByLogin(login)
    {
        const user = await User.findOne({login: login});
        return user == null ? null : user._id;
    }

    async getUserLoginById(user_id)
    {
        const user = await User.findById(user_id);
        return user == null ? null : user.login;
    }

}

module.exports = new user_controller();