const passport = require('passport');
const { encode } = require('html-entities');
const bcrypt = require('bcryptjs');
const LocalStrategy = require("passport-local").Strategy;
const adminModel = require('../../models/admin');
const userModel = require('../../models/user');
const { validEmailAddressandPhoneNo } = require('../../shared/helpers');

passport.use('localAdmin', new LocalStrategy({
    usernameField: "username",
    passwordField: "password"
}, async (username, password, done) => {
    try {
        await adminModel.admin_signin(encode(username)).then((data) => {
            if (data.length > 0) {
                const user = data[0];
                if (bcrypt.compareSync(password, user.password)) {
                    return done(null, user);
                } else {
                    return done(null, {});
                }
            } else {
                return done(null, {});
            }
        }).catch(err => {
            return done(err);
        })
    } catch (err) {
        const error = new Error(err);
        done(error);
    }
})
);

passport.use('localUser', new LocalStrategy({
    usernameField: "username",
    passwordField: "password"
}, async (username, password, done) => {
    try {
        let data = [];
        const checkUsername = validEmailAddressandPhoneNo(username);
        if (checkUsername == 1) {
            data = await userModel.get_user_wrt_email(encode(username));
        } else {
            data = await userModel.get_user_wrt_mobile_no(encode(username));
        }
        if (data && data.length > 0) {
            const user = data[0];
            if (bcrypt.compareSync(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, {});
            }
        } else {
            return done(null, {});
        }
    } catch (err) {
        const error = new Error(err);
        done(error);
    }
})
);


