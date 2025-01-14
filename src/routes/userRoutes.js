const express = require('express');
const userController = require('../modules/user/userController');
const multer = require('multer');
const upload = multer(); // Config cho multer
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('profile', {
        layout: 'main',
        title: 'Profile page',
    });
});

router.post('/createFeedback', userController.createFeedback);
router.put('/updateProfile', userController.updateProfile);
router.get('/api/getProfile', userController.getUserProfile);
router.get('/api/getBookingHistory', userController.getUserBookingHistory);
router.get('/api/getAccount', userController.getAccount);
router.post('/api/changePassword', userController.changePassword);
router.post('/uploadProfilePicture', upload.single('profilePicture'),userController.uploadProfilePicture);
module.exports = router;
