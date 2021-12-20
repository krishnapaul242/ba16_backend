const express = require('express');
const {validateBody} = require('../middleware/validation/schema/validateSchema');
const { isUserAuthenticated, isAdminAuthenticated } = require('../middleware/auth/authentication');
const { add_category, delete_category, add_product, update_product, delete_product} = require('../middleware/validation/schema/productSchema');
const productDbValidate = require('../middleware/validation/db/productDbValidate')
const productController = require('../controllers/product');

const router = express.Router();

router.route('/category').post(isAdminAuthenticated,  validateBody(add_category), productDbValidate.check_category, productController.add_category );
router.route('/category').delete(isAdminAuthenticated, validateBody(delete_category), productDbValidate.check_category, productController.delete_category);
router.route('/category').get(isAdminAuthenticated, productController.get_category_list);
router.route('/').post(isAdminAuthenticated, validateBody(add_product), productDbValidate.check_product, productController.add_product);
router.route('/').put(isAdminAuthenticated, validateBody(update_product), productDbValidate.check_product,productController.update_product);
router.route('/').delete(isAdminAuthenticated, validateBody(delete_product),productDbValidate.check_product,productController.delete_product);
router.route('/').get(isAdminAuthenticated, productController.get_product_list);
router.route('/user').get(productController.get_product_list);
router.route('/category/user').get(isUserAuthenticated, productController.get_category_list);

module.exports = router;
