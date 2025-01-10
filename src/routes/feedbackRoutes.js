const express = require('express');
const feedbaclkController = require('../modules/feedback/feedbackController');

const router = express.Router();

router.get('/api/getFeedbackByTourId/:tour_id', feedbaclkController.getFeedbackByTourId);
module.exports = router;
