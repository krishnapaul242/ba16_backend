const nodemailer = require('nodemailer');
const config = require('./config');

exports.send_external_mail = async (mailOptions) => {
    const transporter = nodemailer.createTransport(config.API_EMAIL.INTERNAL_EMAIL.SENDENING_CONFIGURATION);
    transporter.sendMail(mailOptions, async (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log(info.response);
        }
    });
};

exports.send_b2c_mail = async (mailOptions) => {
    const transporter = nodemailer.createTransport(config.API_EMAIL.B2C_EMAIL.SENDENING_CONFIGURATION);
    transporter.sendMail(mailOptions, async (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log(info.response);
        }
    });
};