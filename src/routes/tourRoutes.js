const express = require('express');
const router = express.Router();
const tourController = require('../modules/tour/tourController');

router.get('/tours/:location_name', tourController.getToursByLocation);
router.get('/tours', tourController.getPopularTours);
router.get('/tour_detail/:tour_id', tourController.getTourByID);

module.exports = router;
