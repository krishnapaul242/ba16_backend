const { encode, decode } = require('html-entities');
const ip = require('ip');
const path = require('path');
const bcrypt = require('bcryptjs');
const base64Img = require("base64-img");
const jimp = require('jimp');
const fs = require('fs');
const config = require('../configuration/config');
const { send_b2c_mail } = require('../configuration/sendMail');
const { generateOTP } = require('../shared/helpers');
const storage = require('../configuration/localStorageConn');
const userModel = require('../models/user');
const { get_current_date_time, add_hours, format_date } = require('../shared/datetime');
const { generate_user_jwt } = require('../configuration/generateJWT');
const { encrypt_data, decrypt_data } = require('../shared/crypto');


exports.user_sign_up_verification = async (req, res, next) => {
    try {
        const {
            name,
            email,
            mobile_no,
            address,
            profile_image,
            password
        } = req.value.body;
        const otp = generateOTP(4);
        const user = {
            name: encode(name),
            email: encode(email),
            mobile_no: encode(mobile_no),
            address: encode(address),
            profile_image: encode(profile_image),
            password: encode(password),
            otp: encode(otp)
        };
        await storage.setItem(user.email, user, { ttl: 3000 * 60 });
        const signupEmailTemplate = config.EMAIL_TEMPLATES.USER_SIGNUP_TEMPLATE;
        const content = signupEmailTemplate.content.replace('USER', user.name).replace('CODE', user.otp);
        const mailOptions = {
            from: config.B2C_MAIL.SENDEING_MAIL_FORM,
            to: user.email,
            subject: signupEmailTemplate.subject,
            html: content
        };
        send_b2c_mail(mailOptions);
        return res.status(200).json({
            message: "OTP successfully send to the email address",
            verificationKey: user.email,
            status: 1
        });
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};


exports.user_sign_up_confirmation = async (req, res, next) => {
    try {
        storage.removeItem(req.value.body.verificationKey);
        const {
            name,
            email,
            mobile_no,
            address,
            password
        } = req.user;

        let user = {
            name: encode(name),
            email: encode(email),
            mobile_no: encode(mobile_no),
            address: JSON.stringify(address),
            password: bcrypt.hashSync(password, 12),
        };
        if (req.user.profile_image && req.user.profile_image != '') {
            const filePath = base64Img.imgSync(req.user.profile_image, path.join('public', config.FILE.USER_PROFILE_IMAGE.PATH), Date.now());
            const pathArr = filePath.split('/');
            const fileName = pathArr[pathArr.length - 1];
            user.profile_image = encode(fileName);
        }
        const userId = await userModel.add_user(user);
        const log = {
            user_id: encode(userId.insertId),
            user_agent: encode(req.get("User-Agent")),
            request_ip: encode(ip.address()),
            login_time: encode(get_current_date_time())
        };
        await userModel.add_user_signin_log(log);
        return res.status(200).json({
            message: "Signup Successful",
            token: generate_user_jwt(userId.insertId, req.get("User-Agent")),
            tokenType: 'Bearer',
            status: 1
        });

    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};

exports.user_signin = async (req, res, next) => {
    try {
        if (Object.keys(req.user).length > 0) {
            const log = {
                user_id: encode(req.user.id),
                user_agent: encode(req.get("User-Agent")),
                request_ip: encode(ip.address()),
                login_time: encode(get_current_date_time())
            };
            await userModel.add_user_signin_log(log).then(() => {
                return res.status(200).json({
                    message: "Signin Successful",
                    token: generate_user_jwt(req.user.id, req.get("User-Agent")),
                    tokenType: 'Bearer',
                    status: 1
                });
            }).catch(err => {
                next(err);
            })
        } else {
            return res.status(400).json({
                message: "Invalid Username and Password",
                status: 0
            });
        }
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};

exports.get_user_profile = async (req, res, next) => {
    try {
        const {
            id,
            name,
            email,
            mobile_no,
            address,
            profile_image,
        } = req.user;
        const img_url = profile_image ? config.API_DETAILS.URL + path.join(config.FILE.USER_PROFILE_IMAGE.PATH, profile_image) : "";
        const user = {
            id: encode(id),
            name: decode(name),
            email: decode(email),
            mobile_no: decode(mobile_no),
            address: decode(address),
            profile_image: decode(img_url)
        };

        return res.status(200).json({
            message: "User details get successfully",
            user: user,
            status: 1
        });

    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};

exports.user_update_profile = async (req, res, next) => {
    try {
        const {
            name,
            email,
            address,
        } = req.value.body;

        let user = {
            name: encode(name),
            email: encode(email),
            address: JSON.stringify(address),
        };
        if (req.value.body.profile_image && req.value.body.profile_image != '') {
            const userData = await userModel.get_user_wrt_id(req.user.id);
            const deletedImagePath = path.join("public", path.join(config.FILE.USER_PROFILE_IMAGE.PATH, userData[0].profile_image));
            const filePath = base64Img.imgSync(req.value.body.profile_image, path.join('public', config.FILE.USER_PROFILE_IMAGE.PATH), Date.now());
            const pathArr = filePath.split('/');
            const fileName = pathArr[pathArr.length - 1];
            user.profile_image = encode(fileName);
            fs.unlinkSync(deletedImagePath);
        }
        await userModel.update_user(user, req.user.id).then(async () => {
            return res.status(200).json({
                message: "User profile updated successfully",
                status: 1
            });
        }).catch(err => {
            next(err);
        });
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};


exports.user_reset_password_getotp = async (req, res, next) => {
    try {
        const {
            email,
            userId,
            name
        } = req.user;
        const otp = generateOTP(4);
        const forgetPasswordEmailTemplate = config.EMAIL_TEMPLATES.USER_FORGET_PASSWORD_TEMPLATE;
        const content = forgetPasswordEmailTemplate.content.replace('USER', name).replace('CODE', otp);
        const token = encrypt_data(JSON.stringify({
            otp: otp,
            userId: userId,
            exp: config.EXPIRY_TIME.FORGET_PASSWORD_TOKEN,
            isVerified: false
        }), config.SECRECT_KEY.CRYPTO_KEY);
        const mailOptions = {
            from: config.B2C_MAIL.SENDEING_MAIL_FORM,
            to: email,
            subject: forgetPasswordEmailTemplate.subject,
            html: content
        };
        send_b2c_mail(mailOptions);
        return res.status(200).json({
            message: "OTP successfully send to the email address",
            token: token,
            status: 1
        });
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};

exports.user_reset_password_verifyotp = async (req, res, next) => {
    try {
        let { token } = req.value.params;
        let decoded = decrypt_data(token, config.SECRECT_KEY.CRYPTO_KEY);
        decoded = JSON.parse(decoded);
        decoded.exp = config.EXPIRY_TIME.FORGET_PASSWORD_TOKEN;
        decoded.isVerified = true;
        token = encrypt_data(JSON.stringify(decoded), config.SECRECT_KEY.CRYPTO_KEY);
        return res.status(200).json({
            message: "OTP successfully verified",
            token: token,
            status: 1
        });
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};

exports.user_reset_password = async (req, res, next) => {
    try {
        const { token } = req.value.params;
        const { password } = req.value.body;
        let decoded = decrypt_data(token, config.SECRECT_KEY.CRYPTO_KEY);
        decoded = JSON.parse(decoded);
        await userModel.update_user({ password: bcrypt.hashSync(password, 12) }, decoded.userId).then(async () => {
            return res.status(200).json({
                message: "Reset password successfully",
                status: 1
            });
        }).catch(err => {
            next(err);
        });
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};

exports.get_user_list = async (req, res, next) => {
    try {
        await userModel.get_user_list().then(async (data) => {
            return res.status(200).json({
                message: "User list fetch successfully",
                data: data,
                status: 1
            });
        }).catch(err => {
            next(err);
        });
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};

exports.get_user_wrt_id = async (req, res, next) => {
    try {
        const {
            name,
            email,
            mobile_no,
            address,
            profile_image,
        } = req.user;
        const img_url = config.API_DETAILS.URL + path.join(config.FILE.USER_PROFILE_IMAGE.PATH, profile_image);
        const user = {
            name: decode(name),
            email: decode(email),
            mobile_no: decode(mobile_no),
            address: decode(address),
            profile_image: decode(img_url)
        };

        return res.status(200).json({
            message: "User details get successfully",
            user: user,
            status: 1
        });

    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};
