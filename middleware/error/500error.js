const { getErrorDetails } = require("../../shared/error");
const config = require("../../configuration/config");
const { send_external_mail } = require("../../configuration/sendMail");

exports.logErrors = async (err, req, res, next) => {
    const error = getErrorDetails(err);
    console.log("====== Error From "  +  config.API_DETAILS.NAME  + "REST API =======");
    console.log("Error Details: ", error.errorText);
    console.log("Error File Name: ", error.errorFile);
    console.log("Error Line Number: ", error.errorLine);
    console.log("Error Time: ", error.errorTime);
    console.error(err.stack);    
    next(error);
};

exports.clientErrorHandler = async (err, req, res, next) => {
    const errorEmailTemplate = config.EMAIL_TEMPLATES.ERROR_TEMPLATE;
    const content = errorEmailTemplate.content.replace('API_URL',  req.url).replace('METHOD',  req.method).replace('DETAILS',  err.errorText).replace('FILE_NAME',  err.errorFile).replace('FILE_LINE_NO',  err.errorLine).replace('TIME',  err.errorTime);
    const mailOptions = {
        from: config.ERROR_MAIL.SENDEING_MAIL_FORM ,
        to:  config.ERROR_MAIL.SENDEING_MAIL_ADDRESS,
        cc: config.ERROR_MAIL.SENDEING_CC_MAIL_ADDRESS,
        subject: errorEmailTemplate.subject,
        html: content
    };
    send_external_mail(mailOptions);
    if (req.xhr) {
        return res.status(500).send({
            message: "Internal Server Error",
            status: 0,
        });
    } else {
        next(err);
    }
};

exports.errorHandler = async (err, req, res, next) => {
    return res.status(500).send({
        message: "Internal Server Error",
        status: 0,
    });
};

