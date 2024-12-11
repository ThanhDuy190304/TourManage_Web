const express = require('express');
const router = express.Router();
const logoutController = require('../modules/logout/logoutController');


router.post('/', logoutController.logoutUser);


module.exports = router;
