const db = require('../../config/db'); // Giả sử bạn có một tệp db.js để kết nối với cơ sở dữ liệu

const Tour = {
	getToursByLocation: async (location_name) => {
		const query = `
		select t.tour_id, t.title, t.brief, t.prices, t_i.img_url, t.location_id
		from tours t inner join locations l on t.location_id = l.location_id
					inner join tour_images t_i on t.tour_id = t_i.tour_id
				where l.location_name = $1 and t_i.img_id = 1
		`;
		const values = [location_name];
		try {
			const result = await db.query(query, values);
			return result.rows;
		} catch (err) {
			throw new Error('Error fetching tours by location: ' + err.message);
		}
	},

	getAllTours: async () => {
		const query = `SELECT t.tour_id, t.title, t.brief, t.prices, t_i.img_url, t.location_id
					FROM tours t 
					left join tour_images t_i ON t.tour_id = t_i.tour_id 
					WHERE t_i.img_id = 1`;
		try {
			const result = await db.query(query); // Remove values here
			return result.rows;
		} catch (err) {
			throw new Error('Error fetching tours by location: ' + err.message);
		}
	},

	getTourByID: async (tour_id) => {
		const query = ` SELECT t.*, t_i.img_url
        FROM tours t
        LEFT JOIN (
            SELECT tour_id, img_url
            FROM tour_images
            WHERE tour_id = $1
            LIMIT 3
        ) t_i ON t.tour_id = t_i.tour_id
        WHERE t.tour_id = $1`;
		const values = [tour_id];
		try {
			const result = await db.query(query, values);
			return result.rows;
		} catch (err) {
			throw new Error('Error fetching tours by location: ' + err.message);
		}

	},

	getToursByIDLocation: async (location_id, tour_id) => {
		const query = `
		select t.tour_id, t.title, t.brief, t.prices, t_i.img_url, t.location_id
		from tours t inner join locations l on t.location_id = l.location_id
					inner join tour_images t_i on t.tour_id = t_i.tour_id
				where l.location_id = $1 and t_i.img_id = 1 and t.tour_id != $2
		`;
		const values = [location_id, tour_id];
		try {
			const result = await db.query(query, values);
			return result.rows;
		} catch (err) {
			throw new Error('Error fetching tours by location: ' + err.message);
		}
	},
};

module.exports = Tour;
