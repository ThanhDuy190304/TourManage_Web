const express = require('express');
const router = express.Router();
const tourController = require('../modules/tour/tourController');

router.get('/api', tourController.getAllToursAPI);
router.get('/:tour_id', tourController.getTourByID);
router.get('/', tourController.getAllTours);

module.exports = router;
