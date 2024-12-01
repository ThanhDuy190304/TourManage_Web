const express = require('express');
const router = express.Router();
const logoutController = require('../modules/logout/logoutController');


router.get('/', logoutController.logoutUser);


module.exports = router;
