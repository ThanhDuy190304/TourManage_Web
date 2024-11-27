const express = require('express');
const router = express.Router();
const registerController = require('../modules/register/registerController');


router.get('/', (req, res) => {
    res.render('register', {
        layout: false,
        title: 'Register Page',
    });
});

// Route đăng ký người dùng
router.post('/postRegister', registerController.registerUser);

module.exports = router;
