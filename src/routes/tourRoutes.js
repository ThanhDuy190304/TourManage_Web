const express = require('express');
const router = express.Router();
const tourController = require('../modules/tour/tourController');

router.get('/api', tourController.getAllToursAPI);
router.get('/getTourbyID/:tour_id', tourController.getTourByID);
router.get('/getAvailableDates/:tour_id', tourController.getAvailableDates);
router.get('/:tour_id', tourController.renderTourByID);
router.get('/', tourController.getAllTours);

module.exports = router;
