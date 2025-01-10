const express = require('express');
const router = express.Router();
const GoogleAuthController = require('../modules/googleAuth/googleAuthController');

router.get('/google', GoogleAuthController.googleAuth);
router.get('/google/callback', GoogleAuthController.googleAuthCallback);
module.exports = router;