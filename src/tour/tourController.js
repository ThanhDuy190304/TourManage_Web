const Tour = require('./tourModel');
const Location = require('../location/locationModel')
const tourController = {

    getToursByLocation: async (req, res) => {
        const { location_name } = req.params

        try {
            const tours = await Tour.getToursByLocation(location_name);
            const location = await Location.getLocationByName(location_name);

            res.render('tours', {
                location_name, loc_detail: location[0].details, tours,
                title: location[0].location_name,
                scripts: '<script src="/js/tours.js"></script>'
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    getPopularTours: async (req, res) => {
        try {
            const tours = await Tour.getPopularTours();

            res.render('tours', {
                location_name: 'Popular',
                loc_detail: `Here is a list of our top tours that we have carefully selected to bring you the best experiences. From journeys to explore pristine nature to cultural excursions rich in local identity, each tour is designed to meet the diverse interests and needs of visitors. With a team of professional guides and dedicated services, we are committed to bringing you a memorable and inspiring journey. Let's explore the most wonderful destinations through our attractive tours!`,
                tours,
                title: 'Tours Page',
                scripts: '<script src="/js/tours.js"></script>'
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getTourByID: async (req, res) => {
        const { tour_id } = req.params
        try {
            const tour_detail = await Tour.getTourByID(tour_id);
            res.render('tour_detail', {
                tour_detail,
                title: tour_detail[0].title
            });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }


};

module.exports = tourController;

