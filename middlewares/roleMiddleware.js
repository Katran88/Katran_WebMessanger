const JwtHelper = require('../helpers/jwtHelper');

const haveNoPermissionReaction = (res) =>
{
    return res.redirect('mandatoryMessage/?permissionDenied');
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
                    haveNoPermissionReaction(res);
                }
            }
            catch (err)
            {
                console.log(err);
                haveNoPermissionReaction(res);
            }
        }
}
