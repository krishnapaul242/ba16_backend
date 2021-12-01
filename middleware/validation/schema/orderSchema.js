const joi = require("@hapi/joi");
const mime = require('mime');
const config = require('../../../configuration/config');
const { validEmailAddress, validPhoneNumber } = require("../../../shared/helpers");

module.exports = {
    user_table_booking: joi.object({
        date: joi.string().trim().required(),
        time: joi.string().trim().required(),
        member: joi.string().trim().regex(/^[0-9]+$/).required(),
    }),
    update_user_table_booking: joi.object({
        status: joi.string().trim().optional().allow(null).allow("").custom((value, helper) => {
            try {
                const arr = ["Approved", "Rejected"];
                if (arr.includes(value)) {
                    return capitalizeFirstLetter(value);
                } else {
                    return helper.message('Enter the Approved or Rejected');
                }
            } catch (err) {
                const error = new Error(err);
                return helper.error(error);
            }
        }),
    }),
    table_booking_id: joi.object({
        id: joi.string().required(),
    }),
    user_order_checkout: joi.object({
        products: joi.array().items(
            joi.object({
              id: joi.string().required(),
              quantity: joi.string().required()
            })
          ).min(1).required()
    }),
};

