const express = require('express');
const router = express.Router();
const verifyController = require('../modules/verify/verifyController'); // Nhập controller

// Route để xác minh tài khoản
router.get('/:token', verifyController.verifyAccount);

module.exports = router;
