const joi = require("@hapi/joi");

module.exports = {
    admin_signin_schema: joi.object({
        username: joi.string().max(8).min(4).required(),
        password: joi.string().max(8).min(4).required(),
    })
};