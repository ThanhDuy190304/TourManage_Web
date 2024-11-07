// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../modules/user/userController');

// Route đăng ký người dùng
router.post('/register', userController.register);

module.exports = router;
