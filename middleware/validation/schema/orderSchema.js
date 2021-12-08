const joi = require("@hapi/joi");
const mime = require('mime');
const config = require('../../../configuration/config');
const { validEmailAddress, validPhoneNumber } = require("../../../shared/helpers");

const string = () => (joi.string().required())
const stringOptional = () => (joi.string().optional().allow(''))
const number = () => (joi.number().required())
const numberOptional = () => (joi.string().optional().allow(''))

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
          line1: stringOptional(),
          line2: stringOptional(),
          landmark: stringOptional(),
          city: stringOptional(),
          district: stringOptional(),
          state: stringOptional(),
          pincode: stringOptional()
      },
      order_type: stringOptional(),
      order_status: joi.string().valid('req','pro','ofd','com').required(),
      payment_status: joi.string().valid('ta','hd').required(),
      payment_comment: stringOptional(),
      user_id: joi.number(),
      user_name: string(),
      user_phone: string(),
    }),
    payment_status: joi.object({
      id: number(),
      payment_status: joi.string().valid('ta', 'hd').required(),
    }),
    order_status: joi.object({
      id: number(),
      order_status: joi.string().valid('req','pro','ofd','com','can').required(),
    }),
    order_status_user: joi.object({
      id: number(),
      order_status: joi.string().valid('can').required(),
    }),
    check_order: joi.object({
      product_details: joi.array().items(
        joi.object({
          product_id: number(),
          quantity: number(),
        })
      ).min(1).required(),
      address_pincode: joi.string().valid('742101', '742102' ,'742103').required(),
    }),
};

