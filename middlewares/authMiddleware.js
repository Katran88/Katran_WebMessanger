const JwtHelper = require('../helpers/jwtHelper');
const user_controller = require('../controllers/user_controller');

function badTokenRes(res)
{
    res.redirect('/login?bad_token');
}

module.exports = async (req, res, next) =>
{
    try
    {
        if(req.url.split('/')[1] == 'mandatoryMessage')
        {
            next();
            return;
        }

        const decodedTokenData = JwtHelper.verifyAndParseToken(req.cookies.token);
        console.log(req.url);
        if(decodedTokenData)
        {
            const user_info = JSON.parse(await user_controller.getInfoJSON(await user_controller.getUserLoginById(decodedTokenData.id)));
            if(user_info.is_blocked)
            {
                res.redirect('mandatoryMessage/?blocked');
            }
            else
            {
                next();
            }
        }
        else
        {
            badTokenRes(res);
        }
    }
    catch (err)
    {
        console.log(err);
        badTokenRes(res);
    }
}