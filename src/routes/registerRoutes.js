// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const registerController = require('../modules/register/registerController');

// Route đăng ký người dùng
router.post('/postRegister', registerController.registerUser);

module.exports = router;
