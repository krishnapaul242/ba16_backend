const express = require('express');
const {validateBody, validateParams} = require('../middleware/validation/schema/validateSchema');
const { isUserAuthenticated, isAdminAuthenticated } = require('../middleware/auth/authentication');
const { product_order, check_order } = require('../middleware/validation/schema/orderSchema');
const orderController = require('../controllers/order');

const router = express.Router();



// router.route('/table/booking').post(isUserAuthenticated,  validateBody(user_table_booking), orderController.add_table_booking);
// router.route('/checkout').post(isUserAuthenticated, validateBody(user_order_checkout), orderController.user_order_checkout);
// router.route('/table/:id').put(isAdminAuthenticated,validateParams(table_booking_id), validateBody(update_user_table_booking));
// router.route('/').get(isAdminAuthenticated, productController.get_product_list);
router.route('/').post(validateBody(product_order), orderController.add_order);
router.route('/check_order').post(validateBody(check_order), orderController.check_order);
router.route('/order_status').put(orderController.update_order_status);
router.route('/payment_status').put(orderController.update_payment_status);
router.route('/:order_status').get(orderController.get_orders);

module.exports = router;
