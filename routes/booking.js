const express = require('express');
const { isAdminAuthenticated, isUserAuthenticated } = require('../middleware/auth/authentication');
const { booking_schema, change_booking_status, change_booking_status_user } = require('../middleware/validation/schema/bookingSchema');
const {validateBody} = require('../middleware/validation/schema/validateSchema');
const bookingController = require('../controllers/booking');
const router = express.Router();

router.route('/:status').get(isAdminAuthenticated, bookingController.get_bookings );
router.route('/').post(isUserAuthenticated, validateBody(booking_schema), bookingController.add_booking);
router.route('/change_status').put(isAdminAuthenticated, validateBody(change_booking_status), bookingController.change_status);
router.route('/change_status/user').put(isAdminAuthenticated, validateBody(change_booking_status_user), bookingController.change_status);
router.route('/check_status').post(isUserAuthenticated, bookingController.check_status);

module.exports = router;
