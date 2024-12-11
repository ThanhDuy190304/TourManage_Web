const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const reservationController = require('../modules/reservation/reservationController');


router.get('/save-reservation', reservationController.showInvoices);
router.post('/api/confirm-reservation', requireAuth, reservationController.confirmReservation);
module.exports = router;