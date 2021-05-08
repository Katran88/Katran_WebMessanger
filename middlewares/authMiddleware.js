const JwtHelper = require('../helpers/jwtHelper');

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
            res.redirect('/login?bad_token');
        }
    }
    catch (err)
    {
        console.log(err);
        res.redirect('/login?bad_token');
    }
}