const express = require('express');
const passport = require('passport');
const passportConf =require('../middleware/auth/passport');
const adminController = require('../controllers/admin');
const {admin_signin_schema} = require('../middleware/validation/schema/adminSchema');
const {validateBody} = require('../middleware/validation/schema/validateSchema');
const {isAdminAuthenticated} = require('../middleware/auth/authentication');

const router = express.Router();
const passportAdminSignIn = passport.authenticate('localAdmin', {session: false}); 


router.route('/signin').post(validateBody(admin_signin_schema), passportAdminSignIn, adminController.admin_signin);
router.route('/profile').get(isAdminAuthenticated, adminController.get_admin_details);


module.exports = router;
