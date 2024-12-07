const express = require('express');
const router = express.Router();
const reservationController = require('../modules/reservation/reservationController');


router.post('/save-reservation', reservationController.showInvoices);

module.exports = router;