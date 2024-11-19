const express = require('express');
const router = express.Router();
const LoginController = require('../modules/login/loginController');

router.post('/postLogin', LoginController.loginUser);

module.exports = router;