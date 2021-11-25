const express = require('express');
const feedController = require("../controllers/feed");

const router = express.Router();

router.route('/postalcode').get(feedController.get_postal_code);

module.exports = router;
