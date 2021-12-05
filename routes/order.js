const express = require('express');
const {validateBody, validateParams} = require('../middleware/validation/schema/validateSchema');
const { isUserAuthenticated, isAdminAuthenticated } = require('../middleware/auth/authentication');
const { product_order, check_order } = require('../middleware/validation/schema/orderSchema');
const orderController = require('../controllers/order');

const router = express.Router();


// router.route('/').post(isUserAuthenticated, validateBody(product_order), orderController.add_order);
router.route('/').post(isUserAuthenticated, validateBody(product_order), orderController.add_order);
router.route('/check_order').post(isUserAuthenticated, validateBody(check_order), orderController.check_order);
router.route('/order_status').put(isAdminAuthenticated, orderController.update_order_status);
router.route('/payment_status').put(isAdminAuthenticated, orderController.update_payment_status);
router.route('/:order_status').get(isAdminAuthenticated, orderController.get_orders);
router.route('/check_status').post(orderController.check_status);
// check status with order id (for user)...

module.exports = router;
