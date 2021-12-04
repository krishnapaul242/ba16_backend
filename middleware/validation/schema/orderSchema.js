const joi = require("@hapi/joi");
const mime = require('mime');
const config = require('../../../configuration/config');
const { validEmailAddress, validPhoneNumber } = require("../../../shared/helpers");

const string = () => (joi.string().required())
const number = () => (joi.number().required())

module.exports = {
    product_order: joi.object({
        ordered_products: joi.array().items(
            joi.object({
              product_id: number(),
              quantity: number(),
              price: number(),
              sub_total: number(),
            })
          ).min(1).required(),
        delivery_charge: number(),
        total: number(),
        address: {
            line1: string(),
            line2: string(),
            landmark: string(),
            city: string(),
            district: string(),
            state: string(),
            pincode: string()
        },
        order_type: string(),
        order_status: string(),
        payment_status: string(),
        payment_comment: string(),
        user_id: number(),
        user_name: string(),
        user_phone: string(),
    }),
    // user_table_booking: joi.object({
    //     date: joi.string().trim().required(),
    //     time: joi.string().trim().required(),
    //     member: joi.string().trim().regex(/^[0-9]+$/).required(),
    // }),
    // update_user_table_booking: joi.object({
    //     status: joi.string().trim().optional().allow(null).allow("").custom((value, helper) => {
    //         try {
    //             const arr = ["Approved", "Rejected"];
    //             if (arr.includes(value)) {
    //                 return capitalizeFirstLetter(value);
    //             } else {
    //                 return helper.message('Enter the Approved or Rejected');
    //             }
    //         } catch (err) {
    //             const error = new Error(err);
    //             return helper.error(error);
    //         }
    //     }),
    // }),
    // table_booking_id: joi.object({
    //     id: joi.string().required(),
    // }),
    // user_order_checkout: joi.object({
    //     products: joi.array().items(
    //         joi.object({
    //           id: joi.string().required(),
    //           quantity: joi.string().required()
    //         })
    //       ).min(1).required()
    // }),
};

