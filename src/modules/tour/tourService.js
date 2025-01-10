// tourService.js
const tourModel = require('./tourModel');
const { format } = require('date-fns');

class TourService {
    static async getTours(page, query,sort, location, rate, minPrice,maxPrice, voucher) {
        try {
            return await tourModel.getTours(page, query,sort,  location, rate, minPrice,maxPrice, voucher);
        } catch (err) {
            throw new Error(err.message);
        }
    }

    static async getTourByID(tour_id) {
        try {
            const tour = await tourModel.getTourByID(tour_id);
            tour.schedulesTour = tour.schedulesTour.map(schedule => {
                schedule.tour_date = format(new Date(schedule.tour_date), 'dd-MM-yyyy');
                return schedule;
            });
            return tour;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    static async getToursByIDLocation(tour_id) {
        try {
            return await tourModel.getToursByIDLocation(tour_id);
        } catch (err) {
            throw new Error(err.message);
        }
    }
}

module.exports = TourService;
