const storage = require('../../configuration/localStorageConn');
const { decrypt_data } = require('../../shared/crypto');
const config = require('../../configuration/config');
const { compare_date_time, get_current_date_time } = require('../../shared/datetime');
const userModel = require('../../models/user');

exports.verify_signup_otp = async (req, res, next) => {
    try {
        const { otp, verificationKey } = req.value.body;
        await storage.getItem(verificationKey).then(async (user) => {
            if (user && user != undefined) {
                if (otp == user.otp) {
                    req.user = user;
                    next();
                } else {
                    return res.status(400).json({
                        error: {
                            otp: "Invalid OTP"
                        },
                        status: 0,
                    });
                }
            } else {
                return res.status(400).json({
                    error: {
                        otp: "OTP time is expire"
                    },
                    status: 0,
                });
            }
        }).catch(err => {
            next(err);
        })
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};

exports.verify_forget_password_token = async (req, res, next) => {
    try {
        const { token } = req.value.params;
        const method = req.method;
        let decoded = decrypt_data(token, config.SECRECT_KEY.CRYPTO_KEY);
        decoded = JSON.parse(decoded);
        if (decoded && decoded != undefined) {
            console.log(decoded, get_current_date_time())
            if (method === "POST") {
                if (req.value.body.otp && req.value.body.otp != decoded.otp) {
                    return res.status(400).json({
                        error: {
                            otp: "Invalid OTP"
                        },
                        status: 0,
                    });
                }
                const compareTime = compare_date_time(get_current_date_time(), decoded.exp);
                if (compareTime == 1) {
                    return res.status(400).json({
                        error: {
                            otp: "OTP time is expire"
                        },
                        status: 0,
                    });
                }
                await userModel.get_user_wrt_id(decoded.userId).then(async (data) => {
                    if (data.length > 0) {
                        next()
                    } else {
                        return res.status(400).json({
                            message: "Invalid User",
                            status: 0,
                        });
                    }
                }).catch(err => {
                    next(err);
                });
            } else if (method === "PUT") {
                if (decoded.isVerified && !req.value.body.otp) {
                    const compareTime = compare_date_time(get_current_date_time(), decoded.exp);
                    if (compareTime == 1) {
                        return res.status(400).json({
                            error: {
                                password: "Your time is over to reset password"
                            },
                            status: 0,
                        });
                    }
                    await userModel.get_user_wrt_id(decoded.userId).then(async (data) => {
                        if (data.length > 0) {
                            next()
                        } else {
                            return res.status(400).json({
                                message: "Invalid User",
                                status: 0,
                            });
                        }
                    }).catch(err => {
                        next(err);
                    });
                }
            }
        } else {
            return res.status(400).json({
                message: "Invalid Reset Password Token",
                status: 0,
            });
        }
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};
