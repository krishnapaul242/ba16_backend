const joi = require("@hapi/joi");

module.exports = {
    add_offer: joi.object({
        image: joi.string().trim().required(),
    }),
    delete_offer: joi.object({
        image: joi.string().trim().required(),
    }),
};

