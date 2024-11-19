const express = require('express');
const router = express.Router();
const LoginController = require('../modules/login/loginController');

router.get('/', (req, res) => {
    res.render('login', {
        layout: false,
        title: 'Login Page',
    });
});

router.get('/forgetpassword', (req, res) => {
    res.render('forgetpassword', {
        layout: false,
        title: 'Forget Password Page',
    })
});


router.post('/postLogin', LoginController.loginUser);

module.exports = router;