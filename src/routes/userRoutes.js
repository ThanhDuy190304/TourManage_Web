const express = require('express');
const userController = require('../modules/user/userController');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('profile', {
        layout: 'main',
        title: 'Profile page',
    });
});


router.get('/api/getProfile', userController.getUserProfile);
router.get('/api/getBookingHistory', userController.getUserBookingHistory);
module.exports = router;
