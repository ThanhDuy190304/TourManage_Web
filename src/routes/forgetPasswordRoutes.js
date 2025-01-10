const express = require('express');
const router = express.Router();
const forgetPasswordController = require('../modules/forgetpassword/forgetpasswordControll');

router.get('/', (req, res) => {
    res.render('forgetPassword', {
        layout: false,
        title: 'Forget Password Page',
    })
});

router.post('/requireNewPassword', forgetPasswordController.requireNewPassword);
module.exports = router;

