const express = require('express');
const router = express.Router();
const LoginController = require('../modules/login/loginController');

router.get('/', (req, res) => {
    if (res.locals.user) {
        return res.redirect('/');
    }
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