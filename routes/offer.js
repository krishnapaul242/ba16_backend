const express = require('express');
const { isUserAuthenticated, isAdminAuthenticated } = require('../middleware/auth/authentication');
const offerController = require('../controllers/offer');

const router = express.Router();

router.route('/').post(isAdminAuthenticated, offerController.add_offer );
router.route('/').delete(isAdminAuthenticated, offerController.delete_offer);
router.route('/').get(offerController.get_offer_list);

module.exports = router;
