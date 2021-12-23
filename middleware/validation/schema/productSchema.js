const joi = require("@hapi/joi");
const mime = require('mime');
const config = require('../../../configuration/config');
const { validEmailAddress, validPhoneNumber, capitalizeFirstLetter } = require("../../../shared/helpers");

module.exports = {
    add_category: joi.object({
        name: joi.string().trim().required(),
    }),
    delete_category: joi.object({
        name: joi.string().trim().required(),
    }),
    add_product: joi.object({
        name: joi.string().trim().required(),
        description: joi.string().optional().allow(''),
        category: joi.string().trim().required(),
        price: joi.string().trim().regex(/^[0-9]+$/).required(),
        discount_price: joi.string().allow(null).allow("").trim().regex(/^[0-9]+$/).optional(),
        is_nonveg: joi.string().trim().custom((value, helper) => {
            try {
                const arr = ['Yes', 'No', 'yes', 'no'];
                if (arr.includes(value)) {
                    return capitalizeFirstLetter(value);
                } else {
                    return helper.message('Enter the Yes or No');
                }
            } catch (err) {
                const error = new Error(err);
                return helper.error(error);
            }
        }).required(),
        is_avaliable: joi.string().trim().optional().allow(null).allow("").custom((value, helper) => {
            try {
                const arr = ['Yes', 'No', 'yes', 'no'];
                if (arr.includes(value)) {
                    return capitalizeFirstLetter(value);
                } else {
                    return helper.message('Enter the Yes or No');
                }
            } catch (err) {
                const error = new Error(err);
                return helper.error(error);
            }
        }),
        image: joi.string().custom((value, helper) => {
            try {
                const matches = value.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
                if (matches && matches.length > 0) {
                    const type = matches && matches[1];
                    const extension = mime.extension(type);
                    if (config.FILE.PRODUCT_IMAGE.FORMAT.includes(extension)) {
                        return value;
                    } else {
                        return helper.message(config.FILE.PRODUCT_IMAGE.ERROR_MESSAGE);
                    }
                } else {
                    return helper.message('Unsupported base64 image format');
                }
            } catch (err) {
                const error = new Error(err);
                return helper.error(error);
            }
        }).optional().allow(null).allow("")
    }),
    update_product: joi.object({
        name: joi.string().trim().required(),
        description: joi.string().optional().allow(''),
        category: joi.string().trim().required(),
        price: joi.string().trim().regex(/^[0-9]+$/).required(),
        discount_price: joi.string().allow(null).allow("").trim().regex(/^[0-9]+$/).optional(),
        is_nonveg: joi.string().trim().custom((value, helper) => {
            try {
                const arr = ['Yes', 'No', 'yes', 'no'];
                if (arr.includes(value)) {
                    return capitalizeFirstLetter(value);
                } else {
                    return helper.message('Enter the Yes or No');
                }
            } catch (err) {
                const error = new Error(err);
                return helper.error(error);
            }
        }).required(),
        is_avaliable: joi.string().trim().optional().allow(null).allow("").custom((value, helper) => {
            try {
                const arr = ['Yes', 'No', 'yes', 'no'];
                if (arr.includes(value)) {
                    return capitalizeFirstLetter(value);
                } else {
                    return helper.message('Enter the Yes or No');
                }
            } catch (err) {
                const error = new Error(err);
                return helper.error(error);
            }
        }),
        image: joi.string().custom((value, helper) => {
            try {
                const matches = value.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
                if (matches && matches.length > 0) {
                    const type = matches && matches[1];
                    const extension = mime.extension(type);
                    if (config.FILE.PRODUCT_IMAGE.FORMAT.includes(extension)) {
                        return value;
                    } else {
                        return helper.message(config.FILE.PRODUCT_IMAGE.ERROR_MESSAGE);
                    }
                } else {
                    return helper.message('Unsupported base64 image format');
                }
            } catch (err) {
                const error = new Error(err);
                return helper.error(error);
            }
        }).optional().allow(null).allow("")
    }),
    delete_product: joi.object({
        name: joi.string().trim().required(),
    })
};

