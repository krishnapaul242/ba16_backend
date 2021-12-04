const express = require('express');
const {validateBody, validateParams} = require('../middleware/validation/schema/validateSchema');
const { isUserAuthenticated, isAdminAuthenticated } = require('../middleware/auth/authentication');
const {user_table_booking, table_booking_id, update_user_table_booking, user_order_checkout, product_order } = require('../middleware/validation/schema/orderSchema');
const orderController = require('../controllers/order');

const router = express.Router();



// router.route('/table/booking').post(isUserAuthenticated,  validateBody(user_table_booking), orderController.add_table_booking);
// router.route('/checkout').post(isUserAuthenticated, validateBody(user_order_checkout), orderController.user_order_checkout);
// router.route('/table/:id').put(isAdminAuthenticated,validateParams(table_booking_id), validateBody(update_user_table_booking));
// router.route('/').get(isAdminAuthenticated, productController.get_product_list);
router.route('/').post(validateBody(product_order),orderController.add_order);

module.exports = router;
