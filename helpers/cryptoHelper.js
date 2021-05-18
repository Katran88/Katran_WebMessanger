const crypto = require('crypto');
const { crypto_secret, crypto_iv  } = require('../config');

const algorithm = 'aes-256-gcm';

class cryptoHelper
{
    encrypt(text)
    {
        let cipher = crypto.createCipheriv(algorithm, crypto_secret, crypto_iv);
        let crypted = cipher.update(text,'utf8','hex');
        crypted += cipher.final('hex');
        return crypted;
    }

    decrypt(text)
    {
        let decipher = crypto.createCipheriv(algorithm, crypto_secret, crypto_iv);
        let dec = decipher.update(text,'hex','utf8');
        dec += decipher.final('utf8');
        return dec;
    }

}

module.exports = new cryptoHelper();



