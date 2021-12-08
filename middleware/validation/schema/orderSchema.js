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
          line1: joi.string().optional(),
          line2: joi.string().optional(),
          landmark: joi.string().optional(),
          city: joi.string().optional(),
          district: joi.string().optional(),
          state: joi.string().optional(),
          pincode: joi.string().optional()
      },
      order_type: joi.string().optional(),
      order_status: joi.string().valid('req','pro','ofd','com').required(),
      payment_status: joi.string().valid('ta','hd').required(),
      payment_comment: joi.string().optional(),
      user_id: joi.number().optional(),
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

