const jwt = require('jsonwebtoken');
const config = require('../../configuration/config');
const { decrypt_data } = require('../../shared/crypto');
const adminModel = require('../../models/admin');
const userModel = require('../../models/user');
const { compare_date_time, get_current_date_time } = require('../../shared/datetime');

exports.isAdminAuthenticated = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            if (token && token != ' ') {
                jwt.verify(token, config.SECRECT_KEY.JWT_KEY, async (err, decoded) => {
                    try {
                        if (err) {
                            return res.status(401).json({
                                message: "Unauthorized",
                                status: 0,
                            });
                        } else {
                            let { iss, ag, sub, exp, isAdmin } = decoded.data;
                            if (!isAdmin) {
                                return res.status(401).json({
                                    message: "Unauthorized",
                                    status: 0,
                                });
                            }
                            ag = decrypt_data(ag, config.SECRECT_KEY.CRYPTO_KEY,);
                            if (iss != config.API_DETAILS.NAME) {
                                return res.status(401).json({
                                    message: "Unauthorized",
                                    status: 0,
                                });
                            }
                            if (ag != req.get("User-Agent")) {
                                return res.status(401).json({
                                    message: "Unauthorized",
                                    status: 0,
                                });
                            } else {
                                const comareDateTime = compare_date_time(get_current_date_time(), exp);
                                if (comareDateTime == 1) {
                                    return res.status(401).json({
                                        message: "Unauthorized",
                                        status: 0,
                                    });
                                }
                                sub = decrypt_data(sub, config.SECRECT_KEY.CRYPTO_KEY);
                                const user = await adminModel.admin_details(sub);
                                if (user.length > 0) {
                                    req.user = user[0];
                                    next();
                                } else {
                                    return res.status(401).json({
                                        message: "Unauthorized",
                                        status: 0,
                                    });
                                }
                            }
                        }
                    } catch (err) {
                        const error = new Error(err);
                        next(error);
                    }
                });
            }
        } else {
            return res.status(401).json({
                message: "Unauthorized",
                status: 0,
            });
        }
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};

exports.isUserAuthenticated = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            if (token && token != ' ') {
                jwt.verify(token, config.SECRECT_KEY.JWT_KEY, async (err, decoded) => {
                    try {
                        if (err) {
                            return res.status(401).json({
                                message: "Unauthorized",
                                status: 0,
                            });
                        } else {
                            let { iss, ag, sub, exp, isAdmin } = decoded.data;
                            if (isAdmin) {
                                return res.status(401).json({
                                    message: "Unauthorized",
                                    status: 0,
                                });
                            }
                            ag = decrypt_data(ag, config.SECRECT_KEY.CRYPTO_KEY,);
                            if (iss != config.API_DETAILS.NAME) {
                                return res.status(401).json({
                                    message: "Unauthorized",
                                    status: 0,
                                });
                            }
                            if (ag != req.get("User-Agent")) {
                                return res.status(401).json({
                                    message: "Unauthorized",
                                    status: 0,
                                });
                            } else {
                                const comareDateTime = compare_date_time(get_current_date_time(), exp);
                                if (comareDateTime == 1) {
                                    return res.status(401).json({
                                        message: "Unauthorized",
                                        status: 0,
                                    });
                                }
                                sub = decrypt_data(sub, config.SECRECT_KEY.CRYPTO_KEY);
                                const user = await userModel.get_user_wrt_id(sub);
                                if (user.length > 0) {
                                    req.user = user[0];
                                    next();
                                } else {
                                    return res.status(401).json({
                                        message: "Unauthorized",
                                        status: 0,
                                    });
                                }
                            }
                        }
                    } catch (err) {
                        const error = new Error(err);
                        next(error);
                    }
                });
            }
        } else {
            return res.status(401).json({
                message: "Unauthorized",
                status: 0,
            });
        }
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};
