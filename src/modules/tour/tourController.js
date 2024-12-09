const Tour = require('./tourModel');
const CTour = require('./Ctour');
const tourController = {

    getAllToursAPI: async (req, res) => {
        try {
            const { page, query = 'default', location = ['default'], rate = [-1], price = [-1], voucher = [-1] } = req.query;
            const allTours = await Tour.getTours(page, query, location, rate, price, voucher);

            res.json(allTours);  // Trả về HTML
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    getAllTours: async (req, res) => {
        try {
            const { page, query = 'default', location = ['default'], rate = [-1], price = [-1], voucher = [-1] } = req.query;
            const allTours = await Tour.getTours(page, query, location, rate, price, voucher);
            res.render('tours', {
                layout: 'main',
                location_name: 'Popular',
                allTours: allTours.paginatedTours,
                totalPages: allTours.totalPages,
                loc_detail: `Here is a list of our top tours that we have carefully selected to bring you the best experiences. From journeys to explore pristine nature to cultural excursions rich in local identity, each tour is designed to meet the diverse interests and needs of visitors. With a team of professional guides and dedicated services, we are committed to bringing you a memorable and inspiring journey. Let's explore the most wonderful destinations through our attractive tours!`,
                title: 'Tours Page',
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    renderTourByID: async (req, res) => {
        const { tour_id } = req.params
        try {
            const [tour, related] = await Promise.all([
                Tour.getTourByID(tour_id),
                Tour.getToursByIDLocation(tour_id)
            ]);
            res.render('tour_detail', {
                layout: 'main',
                tour: tour,
                related,
                title: tour.brief,
            });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }


};

module.exports = tourController;