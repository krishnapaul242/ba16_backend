const joi = require("@hapi/joi");

const string = () => joi.string().required()
const number = () => joi.number().required()

module.exports = {
    booking_schema: joi.object({
        number_of_prople: number(),
        dateTime: string(),
        booking_status: joi.string().valid("req", "app", "can", "com").required(),
        user_id: number(),
        user_name: string(),
        user_phone: string()
    }),
    change_booking_status: joi.object({
        id: number(),
        booking_status: joi.string().valid("req", "app", "can", "com").required(),
    })
};