const jwt = require("jsonwebtoken");
const config = require('./config');
const { get_current_date_time, format_date } = require('../shared/datetime');
const { encrypt_data } = require('../shared/crypto');

module.exports = {
    generate_admin_jwt: (sub, ag) => {
        const token = jwt.sign({
            data: {
                iss: config.API_DETAILS.NAME,
                ag: encrypt_data(ag, config.SECRECT_KEY.CRYPTO_KEY),
                sub: encrypt_data(String(sub), config.SECRECT_KEY.CRYPTO_KEY),
                iat: format_date(get_current_date_time(), "yyyy-MM-dd HH:mm:ss"),
                isAdmin: true,
                exp: config.EXPIRY_TIME.ADMIN_LOGIN_TOKEN
            }
        }, config.SECRECT_KEY.JWT_KEY);
        return token;
    },

    generate_user_jwt: (sub, ag) => {
        const token = jwt.sign({
            data: {
                iss: config.API_DETAILS.NAME,
                ag: encrypt_data(ag, config.SECRECT_KEY.CRYPTO_KEY),
                sub: encrypt_data(String(sub), config.SECRECT_KEY.CRYPTO_KEY),
                iat: format_date(get_current_date_time(), "yyyy-MM-dd HH:mm:ss"),
                isAdmin: false,
                exp: config.EXPIRY_TIME.USER_LOGIN_TOKEN
            }
        }, config.SECRECT_KEY.JWT_KEY);
        return token;
    },


}