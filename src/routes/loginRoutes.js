const express = require('express');
const router = express.Router();
const LoginController = require('../modules/login/loginController');

router.get('/', (req, res) => {
    res.render('login', {
        layout: false,
        title: 'Login Page',
    });
});

router.post('/postLogin', LoginController.loginUser);

module.exports = router;