const joi = require("@hapi/joi");
const mime = require('mime');
const config = require('../../../configuration/config');
const { validEmailAddress, validPhoneNumber } = require("../../../shared/helpers");

module.exports = {
    user_signup_verification_schema: joi.object({
        name: joi.string().trim().required(),
        email: joi.string().trim().email().lowercase().required(),
        mobile_no: joi.string().trim().min(10).max(10).regex(/^[0-9]+$/).required(),
        address: joi.object({
            line1: joi.string().trim().required(),
            line2: joi.string().trim().optional().allow(null).allow(""),
            city: joi.string().trim().default("Berhampore").allow(null).allow(""),
            district: joi.string().trim().default("Murshidabad").allow(null).allow(""),
            state: joi.string().trim().default("West Bengal").allow(null).allow(""),
            landmark: joi.string().trim().optional().allow(null).allow(""),
            pincode: joi.string().trim().min(6).max(6).regex(/^[0-9]+$/).required(),
        }).required(),
        profile_image: joi.string().optional().allow(null).allow("").custom((value, helper) => {
            try {
                const matches = value.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
                if (matches && matches.length > 0) {
                    const type = matches && matches[1];
                    const extension = mime.extension(type);
                    if (config.FILE.USER_PROFILE_IMAGE.FORMAT.includes(extension)) {
                        return value;
                    } else {
                        return helper.message(config.FILE.USER_PROFILE_IMAGE.ERROR_MESSAGE);
                    }
                } else {
                    return helper.message('Unsupported base64 image format');
                }
            } catch (err) {
                const error = new Error(err);
                return helper.error(error);
            }
        }),
        password: joi.string().trim().max(8).min(4).required(),
    }),
    user_signup_otp_verification_schema: joi.object({
        otp: joi.string().trim().min(4).max(4).regex(/^[0-9]+$/).required(),
        verificationKey: joi.string().trim().email().lowercase().required(),
    }),
    user_signin_schema: joi.object({
        username: joi.string().trim().required().custom((value, helper) => {
            try {
                console.log(validEmailAddress(value))
                if (validEmailAddress(value)) {
                    return value;
                } else if (validPhoneNumber(value)) {
                    return value;
                } else {
                    return helper.message('Enter the valid email address or phone number');
                }
            } catch (err) {
                const error = new Error(err);
                return helper.error(error);
            }
        }),
        password: joi.string().trim().max(8).min(4).required(),
    }),
    user_update_profile_schema: joi.object({
        name: joi.string().trim().required(),
        email: joi.string().trim().email().lowercase().required(),
        address: joi.object({
            line1: joi.string().trim().required(),
            line2: joi.string().trim().optional().allow(null).allow(""),
            landmark: joi.string().trim().optional().allow(null).allow(""),
            city: joi.string().trim().allow(null).allow("").default("Berhampore"),
            district: joi.string().trim().allow(null).allow("").default("Murshidabad"),
            state: joi.string().trim().allow(null).allow("").default("West Bengal"),
            pincode: joi.string().trim().min(6).max(6).regex(/^[0-9]+$/).required(),
        }).required(),
        profile_image: joi.string().optional().allow(null).allow("").custom((value, helper) => {
            try {
                const matches = value.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
                if (matches && matches.length > 0) {
                    const type = matches && matches[1];
                    const extension = mime.extension(type);
                    if (config.FILE.USER_PROFILE_IMAGE.FORMAT.includes(extension)) {
                        return value;
                    } else {
                        return helper.message(config.FILE.USER_PROFILE_IMAGE.ERROR_MESSAGE);
                    }
                } else {
                    return helper.message('Unsupported base64 image format');
                }
            } catch (err) {
                const error = new Error(err);
                return helper.error(error);
            }
        }),
    }),
    user_reset_password_getotp: joi.object({
        username: joi.string().trim().required().custom((value, helper) => {
            try {
                if (validEmailAddress(value)) {
                    return value;
                } else if (validPhoneNumber(value)) {
                    return value;
                } else {
                    return helper.message('Enter the valid email address or phone number');
                }
            } catch (err) {
                const error = new Error(err);
                return helper.error(error);
            }
        }),
    }),
    user_reset_password_verifyotp: joi.object({
        otp: joi.string().trim().min(4).max(4).regex(/^[0-9]+$/).required()
    }),
    forget_password_token: joi.object({
        token: joi.string().trim().required()
    }),
    user_reset_password: joi.object({
        password: joi.string().trim().max(8).min(4).required(),
    }),
    user_id: joi.object({
        id: joi.string().required(),
    })
};

