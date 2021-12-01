const userModel = require('../../../models/user');
const { validEmailAddressandPhoneNo } = require('../../../shared/helpers');

exports.user_signup_verification = async (req, res, next) => {
    try {
        const { email, mobile_no } = req.value.body;
        let err = {};
        const emailExist = await userModel.get_user_wrt_email(email);
        const phoneNoExist = await userModel.get_user_wrt_mobile_no(mobile_no);
        if (emailExist && emailExist.length > 0) {
            err.email = "Email address already exist";
        }

        if (phoneNoExist && phoneNoExist.length > 0) {
            err.mobile_no = "Mobile number already exist";
        }

        if (Object.keys(err).length > 0) {
            return res.status(400).json({
                error: err,
                status: 0,
            });
        } else {
            next();
        }

    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};

exports.check_user_email = async (req, res, next) => {
    try {
        const { email } = req.value.body;
        let err = {};
        const emailExist = await userModel.check_updated_email(email, req.user.id);
        if (emailExist && emailExist.length > 0) {
            err.email = "Email address already exist";
        }
        if (Object.keys(err).length > 0) {
            return res.status(400).json({
                error: err,
                status: 0,
            });
        } else {
            next();
        }

    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};

exports.check_user = async (req, res, next) => {
    try {
        const { username } = req.value.body;
        const checkUsername = validEmailAddressandPhoneNo(username);
        let data = [];
        let err = {};
        if (checkUsername == 1) {
            data = await userModel.get_user_wrt_email(username);
        } else {
            data = await userModel.get_user_wrt_mobile_no(username);
        }
        if (data.length  == 0) {
            err.username = "Invalid Username";
        }
        if (Object.keys(err).length > 0) {
            return res.status(400).json({
                error: err,
                status: 0,
            });
        } else {
            const user = {
                email: data[0].email,
                userId: data[0].id,
                name: data[0].name
            };
            req.user = user;
            next();
        }

    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};

exports.check_user_id = async (req, res, next) => {
    try {
      const {id} = req.value.params;
      await userModel.get_user_wrt_id(id).then(async (data) => {
          if(data.length > 0) {
               req.user = data[0];
               next();
          } else {
            return res.status(400).json({
                message: "User id does not exist",
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



