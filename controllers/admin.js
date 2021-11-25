const ip = require('ip');
const { encode } = require('html-entities');
const config = require('../configuration/config');
const { encrypt_data } = require('../shared/crypto');
const adminModel = require('../models/admin');
const { get_current_date_time, add_hours, format_date } = require('../shared/datetime');
const { generate_admin_jwt } = require('../configuration/generateJWT');

exports.admin_signin = async (req, res, next) => {
    try {
        if (Object.keys(req.user).length > 0) {
            const log = {
                admin_id: encode(req.user.id),
                user_agent: encode(req.get("User-Agent")),
                request_ip: encode(ip.address()),
                login_time: encode(get_current_date_time())
            };
            await adminModel.add_admin_signin_log(log).then(() => {
                return res.status(200).json({
                    message: "Signin Successful",
                    token: generate_admin_jwt(req.user.id,req.get("User-Agent")),
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
}

exports.get_admin_details = async (req, res, next) => {
    try {
        return res.status(200).json({
            user: req.user.name,
            status: 1
        })
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
}
