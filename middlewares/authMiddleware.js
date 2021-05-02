const JwtHelper = require('../helpers/jwtHelper');

const authErrorMessage = (res) =>
{
    return res.status(403).json({message: 'You are not authorized'});
}

module.exports = (req, res, next) =>
{
    try
    {
        const decodedTokenData = JwtHelper.verifyAndParseToken(req.cookies.token);

        if(decodedTokenData)
        {
            next();
        }
        else
        {
            return authErrorMessage(res);
        }
    }
    catch (err)
    {
        console.log(err);
        return authErrorMessage(res);
    }
}