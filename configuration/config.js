// process.env.NODE_ENV === "production" ?
//     require("dotenv").config({ path: "./.env.production" }) :
//     require("dotenv").config({ path: "./.env.development" });
if (process.env.NODE_ENV === "production") {
    require("dotenv").config({ path: "./.env.production" })
}else if(process.env.NODE_ENV === "development"){
    require("dotenv").config({ path: "./.env.development" });
}else{
    require("dotenv").config({ path: "./.env.testing" });
}

const { get_current_date_time, add_days, add_minutes } = require("../shared/datetime");

module.exports = {

    API_DETAILS: {
        NAME: process.env.API_NAME,
        OWNER: process.env.API_OWNER,
        EMAIL: process.env.API_OWNER_EMAIL,
        PORT: process.env.API_RUNNING_PORT,
        URL: process.env.API_URL,
        DEVELOPER: {
            NAME: process.env.API_DEVELOPER_NAME,
            EMAIL: process.env.API_DEVELOPER_EMAIL,
            TEAM: [
                {
                    NAME: process.env.API_DEVELOPER_M1_NAME,
                    EMAIL: process.env.API_DEVELOPER_M1_EMAIL
                }
            ]
        },
    },

    DB: {
        MYSQL_HOST: process.env.MYSQL_HOST,
        MYSQL_PORT: process.env.MYSQL_PORT,
        MYSQL_USER: process.env.MYSQL_USER,
        MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
        MYSQL_DATABASE: process.env.MYSQL_DATABASE
    },

    SECRECT_KEY: {
        JWT_KEY: process.env.JWT_KEY,
        CRYPTO_KEY: process.env.CRYPTO_KEY
    },

    API_EMAIL: {
        B2C_EMAIL: {
            SENDENING_CONFIGURATION: {
                host: process.env.EXTERNAL_EMAIL_HOST,
                port: process.env.EXTERNAL_EMAIL_HOST_PORT,
                secure: true,
                auth: {
                    user: process.env.EXTERNAL_EMAIL,
                    pass: process.env.EXTERNAL_EMAIL_PASSWORD
                }
            }
        },

        INTERNAL_EMAIL: {
            SENDENING_CONFIGURATION: {
                host: process.env.INTERNAL_EMAIL_HOST,
                port: process.env.INTERNAL_EMAIL_HOST_PORT,
                secure: true,
                auth: {
                    user: process.env.INTERNAL_EMAIL,
                    pass: process.env.INTERNAL_EMAIL_PASSWORD
                }
            },
        }
    },

    EXPIRY_TIME: {
        ADMIN_LOGIN_TOKEN: add_days(get_current_date_time(), 1),
        USER_LOGIN_TOKEN: add_days(get_current_date_time(), 7),
        FORGET_PASSWORD_TOKEN: add_minutes(get_current_date_time(), 3)
    },

    ERROR_MAIL: {
        SENDEING_MAIL_FORM: process.env.NODE_ENV === 'production' ? process.env.API_OWNER_EMAIL : process.env.INTERNAL_EMAIL,
        SENDEING_MAIL_ADDRESS:  [process.env.API_DEVELOPER_EMAIL],
        SENDEING_CC_MAIL_ADDRESS:  [process.env.API_DEVELOPER_M1_EMAIL],
    },

    B2C_MAIL: {
        SENDEING_MAIL_FORM:  process.env.EXTERNAL_EMAIL,
    },

    FILE: {
        USER_PROFILE_IMAGE: {
            FORMAT: ['jpg', 'jpeg', 'png'],
            ERROR_MESSAGE: "Only png, jpeg and jpg photo can be uploaded",
            PATH: process.env.USER_PROFILE_IMAGE_PATH,
            HEIGHT: 400,
            WIDTH: 400
        },
        PRODUCT_IMAGE: {
            FORMAT: ['jpg', 'jpeg', 'png'],
            ERROR_MESSAGE: "Only png, jpeg and jpg photo can be uploaded",
            PATH: process.env.PRODUCT_IMAGE_PATH,
            HEIGHT: 400,
            WIDTH: 400
        },
        OFFER_IMAGE: {
            PATH: process.env.OFFER_IMAGE_PATH,
        }
    },

    EMAIL_TEMPLATES: {
        ERROR_TEMPLATE: {
            subject: "16 Ana Bangalee Internal Server Error",
            content: `
                <p>Hello Server Team,</p>
                <p>There is some error happend in the ${process.env.NODE_ENV === 'production' ? 'production' : 'development'} server. The error details are following -</p>
                <p><b>API URL:</b>  API_URL </p>
                <p><b>HTTP Method:</b>  METHOD </p>
                <p><b>Error Details:</b>  DETAILS </p>
                <p><b>Error File Name:</b>  FILE_NAME </p>
                <p><b>Error Line Number:</b>  FILE_LINE_NO </p>
                <p><b>Error Time:</b> TIME </p>
                <p>Please check this.</p>
                <p>Regards</p>
                <p>16 Ana Bangalee</p>
            `
        },
        USER_SIGNUP_TEMPLATE: {
            subject: "16 Ana Bangalee",
            content: `
           <p>  <b>Hi USER, </b> </p>
            <p> We have received a request to signup your 16 ana bangalee account. Please use the following <br> one-time password to verify yourself. </p>
            <p> <b> OTP: CODE </b> <p>
            <p> (The OTP will be valid for the next three minutes) </p>
            <p>Regards, </p>
            <p>Saidul Hussain </p>
        `
        },
        USER_FORGET_PASSWORD_TEMPLATE: {
            subject: "Reset 16 Ana Bangalee account password",
            content: `
           <p>  <b>Hi USER, </b> </p>
            <p> We have received a request to reset your 16 ana bangalee account password. Please use the following one-time password to verify yourself. <br> one-time password to verify yourself. </p>
            <p> <b> OTP: CODE </b> <p>
            <p> (The OTP will be valid for the next three minutes) </p>
            <p>Regards, </p>
            <p>Saidul Hussain </p>
        `
        }
    }
}
