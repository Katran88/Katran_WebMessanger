const jwt = require('jsonwebtoken');
const { token_secret } = require('../config');

class JwtHelper
{
    generateToken(userId, role)
    {
        const payload = { id: userId, role };

        return jwt.sign(payload, token_secret, {expiresIn: '720d'});
    }

    verifyAndParseToken(token)
    {
        try
        {
            if(!token)
            {
                throw 'bad token';
            }
            const verifiedData = jwt.verify(token, token_secret);

            return verifiedData ? verifiedData : undefined;
        }
        catch (err)
        {
            console.log(err);
            return undefined;
        }
    }
}

module.exports = new JwtHelper();