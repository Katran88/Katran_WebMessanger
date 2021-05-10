const JwtHelper = require('../helpers/jwtHelper');

function badTokenRes(res)
{
    res.redirect('/login?bad_token');
}

module.exports = (req, res, next) =>
{
    try
    {
        const decodedTokenData = JwtHelper.verifyAndParseToken(req.cookies.token);
        console.log(req.url);
        if(decodedTokenData)
        {
            next();
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