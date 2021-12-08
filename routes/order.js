const express = require('express');
const {validateBody} = require('../middleware/validation/schema/validateSchema');
const { isUserAuthenticated, isAdminAuthenticated } = require('../middleware/auth/authentication');
const { product_order, check_order, order_status, payment_status, order_status_user } = require('../middleware/validation/schema/orderSchema');
const orderController = require('../controllers/order');

const router = express.Router();

router.route('/').post(isUserAuthenticated, validateBody(product_order), orderController.add_order);
router.route('/check_order').post(isUserAuthenticated, validateBody(check_order), orderController.check_order);
router.route('/order_status').put(isAdminAuthenticated, validateBody(order_status), orderController.update_order_status);
router.route('/order_status/user').put(isUserAuthenticated, validateBody(order_status_user), orderController.update_order_status_user);
router.route('/payment_status').put(isAdminAuthenticated, validateBody(payment_status),  orderController.update_payment_status);
router.route('/:order_status').get(isAdminAuthenticated, orderController.get_orders);
router.route('/user').get(isUserAuthenticated, orderController.get_orders_user);
router.route('/check_status').post(isUserAuthenticated, orderController.check_status);

module.exports = router;
