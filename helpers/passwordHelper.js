const bcrypt = require('bcrypt');
const { password_salt } = require('../config');

class PasswordHelper
{
    generateHash(password)
    {
        return bcrypt.hashSync(password, password_salt);
    }

    compareWithHashFromDB(original_password, hashed_password)
    {
        return bcrypt.compareSync(original_password, hashed_password);
    }
}

module.exports = new PasswordHelper();