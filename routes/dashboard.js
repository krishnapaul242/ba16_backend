const express = require('express');
const { isAdminAuthenticated } = require('../middleware/auth/authentication');
const dashboardController = require('../controllers/dashboard');

const router = express.Router();

router.route('/statistics').get(isAdminAuthenticated, dashboardController.getStatistics);
// router.route('/chart').delete(isAdminAuthenticated, dashboardController.getChart);

module.exports = router;
