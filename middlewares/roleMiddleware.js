const JwtHelper = require('../helpers/jwtHelper');

const roleErrorMessage = (res) =>
{
    return res.status(403).json({message: 'You have no permission for this action'});
}

module.exports = (roles) =>
{
    return  function (req, res, next)
            {
                try
                {
                    const { role: visitorRole } = JwtHelper.verifyAndParseToken(req.cookies.token);

                    if(roles.includes(visitorRole))
                    {
                        next();
                    }
                    else
                    {
                        return roleErrorMessage(res);
                    }
                }
                catch (err)
                {
                    console.log(err);
                    return roleErrorMessage(res);
                }
            }
}
