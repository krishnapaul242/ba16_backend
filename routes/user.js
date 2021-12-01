const express = require('express');
const passport = require('passport');
const {
    user_signup_verification_schema,
    user_signup_otp_verification_schema,
    user_signin_schema,
    user_update_profile_schema,
    user_reset_password_getotp,
    forget_password_token,
    user_reset_password_verifyotp,
    user_reset_password,
    user_id
} = require('../middleware/validation/schema/userSchema');
const passportConf = require('../middleware/auth/passport');
const { validateBody, validateParams } = require('../middleware/validation/schema/validateSchema');
const verification = require('../middleware/auth/verification');
const userDbValidate = require('../middleware/validation/db/userDbValidate');
const userController = require('../controllers/user');
const { isUserAuthenticated, isAdminAuthenticated } = require('../middleware/auth/authentication');

const router = express.Router();
const passportUserSignIn = passport.authenticate('localUser', { session: false });


router.route('/profile').get(isUserAuthenticated, userController.get_user_profile);

router.route('/signup/verification').post(validateBody(user_signup_verification_schema), userDbValidate.user_signup_verification, userController.user_sign_up_verification);

router.route('/signup/confirmation').post(validateBody(user_signup_otp_verification_schema), verification.verify_signup_otp, userController.user_sign_up_confirmation);

router.route('/signin').post(validateBody(user_signin_schema), passportUserSignIn, userController.user_signin);

router.route('/update').put(isUserAuthenticated, validateBody(user_update_profile_schema), userDbValidate.check_user_email, userController.user_update_profile);

router.route('/password/getotp').post(validateBody(user_reset_password_getotp), userDbValidate.check_user, userController.user_reset_password_getotp);

router.route('/password/verifyotp/:token').post(validateParams(forget_password_token), validateBody(user_reset_password_verifyotp), verification.verify_forget_password_token, userController.user_reset_password_verifyotp);

router.route('/password/reset/:token').put(validateParams(forget_password_token), validateBody(user_reset_password),  verification.verify_forget_password_token, userController.user_reset_password);

router.route('/').get(isAdminAuthenticated, userController.get_user_list);
router.route('/:id').get(isAdminAuthenticated,  validateParams(user_id), userDbValidate.check_user_id, userController.get_user_wrt_id);


module.exports = router;
