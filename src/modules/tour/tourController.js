const Tour = require('./tourModel');
const CTour = require('./Ctour');
const tourController = {

    getAllToursAPI: async (req, res) => {
        try {
            const { page, query = 'default', location = ['default'], rate = [-1], price = [-1], voucher = [-1] } = req.query;
            const allTours = await Tour.getTours(page, query, location, rate, price, voucher);
            let html = '';
            if (allTours.paginatedTours.length === 0 || page > allTours.totalPages) {
                html = '<p>No tours available</p>';
            }
            allTours.paginatedTours.forEach(tour => {
                html += `
                <a href="/tours/${tour.tour_id}" class="w-80 md:w-96 lg:w-80 mx-auto">
                    <div
                        class="flex flex-col justify-between bg-white rounded-lg shadow-lg overflow-hidden w-80 md:w-96 lg:w-80 h-96 tour transition-transform duration-300 ease-in-out hover:scale-105 mx-auto">
                        <div>
                            <!-- Giảm kích thước hình ảnh -->
                            <img src="${tour.img_url}" alt="" class="img w-full h-36 object-cover">
                            <div class="p-4">
                                <div class="flex justify-between mt-4 h-16">
                                    <h3 class="name text-lg font-semibold">${tour.title}</h3>
                                    <p class="price text-gray-600">$${tour.prices}</p>
                                </div>
                                <p class="text-gray-600 w-full overflow-hidden text-ellipsis line-clamp-2">
                                ${tour.brief}
                                </p>
                            </div>
                        </div>
                        <div class="flex justify-between px-4">
                            <div class="flex">
                                <i class="fa-solid fa-star text-yellow-500"></i>
                                <i class="fa-solid fa-star text-yellow-500"></i>
                                <i class="fa-solid fa-star text-yellow-500"></i>
                                <i class="fa-solid fa-star text-yellow-500"></i>
                                <i class="fa-solid fa-star text-yellow-500"></i>
                            </div>
                            <button type="button"
                                class="self-end mb-4 px-4 py-2 bg-green-900 text-white rounded-full hover:bg-green-950 btn"
                                value="${tour.tour_id}" onclick="StoreId(this)">View
                                Detail</button>
                        </div>
                    </div>
                </a>
                `;
            });

            res.json({ html, totalPages: allTours.totalPages });  // Trả về HTML
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    getAllTours: async (req, res) => {
        try {

            res.render('tours', {
                layout: 'main',
                location_name: 'Popular',
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
                Tour.renderGetTourByID(tour_id),
                Tour.getToursByIDLocation(tour_id)
            ]);
            res.render('tour_detail', {
                layout: 'main',
                tour: tour.toJSON(),
                related,
                user: JSON.stringify(res.locals.user),
                title: tour.getBrief(),
            });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    getAvailableDates: async (req, res) => {
        const { tour_id } = req.params
        try {
            const tour_detail = await Tour.getAvailableDates(tour_id);
            res.json(tour_detail);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    getTourByID: async (req, res) => {
        const { tour_id } = req.params
        try {
            const tour_detail = await Tour.getTourByID(tour_id);
            res.json(tour_detail);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }


};

module.exports = tourController;