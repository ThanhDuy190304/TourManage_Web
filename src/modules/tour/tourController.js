const Tour = require('./tourModel');
const Location = require('../location/locationModel')
const tourController = {

    getToursByLocation: async (req, res) => {
        const { location_name } = req.params

        try {
            const tours = await Tour.getToursByLocation(location_name);
            const location = await Location.getLocationByName(location_name);

            res.render('tours', {
                layout: 'main',
                location_name, loc_detail: location[0].details, tours,
                title: location[0].location_name,
                scripts: '<script src="/js/tours.js"></script>'
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    getAllTours: async (req, res) => {
        try {
            const searchQuery = req.query.query ?? 'default'
            const locationQuery = req.query.location ?? ['default']
            const rateQuery = req.query.rate ?? [-1]
            const priceQuery = req.query.price ?? [-1]
            const voucherQuery = req.query.voucher ?? [-1]
            const tours = await Tour.getAllTours(searchQuery);
            const locations = await Tour.getAlllocationTours(locationQuery);
            const rates = await Tour.getAllrateTours(rateQuery);
            const prices = await Tour.getAllpriceTours(priceQuery);
            const vouchers = await Tour.getAllvoucherTours(voucherQuery);
            const allTours = await Tour.getTours(tours,locations, rates, prices, vouchers);
            res.render('tours', {
                layout: 'main',
                location_name: 'Popular',
                loc_detail: `Here is a list of our top tours that we have carefully selected to bring you the best experiences. From journeys to explore pristine nature to cultural excursions rich in local identity, each tour is designed to meet the diverse interests and needs of visitors. With a team of professional guides and dedicated services, we are committed to bringing you a memorable and inspiring journey. Let's explore the most wonderful destinations through our attractive tours!`,
                allTours,
                title: 'Tours Page',
                scripts: '<script src="/js/tours.js"></script>'
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getTourByID: async (req, res) => {
        const { tour_id, location_id } = req.params
        try {
            const tour_detail = await Tour.getTourByID(tour_id);
            const related = await Tour.getToursByIDLocation(location_id, tour_id);
            res.render('tour_detail', {
                layout: 'main',
                tour_detail,
                related,
                title: tour_detail[0].title
            });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }


};

module.exports = tourController;

