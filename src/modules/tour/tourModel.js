const db = require('../../config/db'); // Giả sử bạn có một tệp db.js để kết nối với cơ sở dữ liệu
const Tour = {

	getTours: async (page, search, location, rate, price, voucher) => {
		const [searchs, locations, rates, prices, vouchers] = await Promise.all([
			Tour.searchTours(search),
			Tour.filterlocationTours(location),
			Tour.filterrateTours(rate),
			Tour.filterpriceTours(price),
			Tour.filtervoucherTours(voucher)
		]);

		const tourIds1 = searchs.map(item => item.tour_id);
		const tourIds2 = locations.map(item => item.tour_id);
		const tourIds3 = rates.map(item => item.tour_id);
		const tourIds4 = prices.map(item => item.tour_id);
		const tourIds5 = vouchers.map(item => item.tour_id);

		// Tìm các tour_id xuất hiện trong tất cả 5 mảng
		const commonTourIds = tourIds1.filter(id =>
			tourIds2.includes(id) &&
			tourIds3.includes(id) &&
			tourIds4.includes(id) &&
			tourIds5.includes(id)
		);

		// Lọc các đối tượng từ các mảng tour ban đầu có tour_id xuất hiện trong commonTourIds
		const mergedTours = [
			...searchs.filter(item => commonTourIds.includes(item.tour_id)),
			...locations.filter(item => commonTourIds.includes(item.tour_id)),
			...rates.filter(item => commonTourIds.includes(item.tour_id)),
			...prices.filter(item => commonTourIds.includes(item.tour_id)),
			...vouchers.filter(item => commonTourIds.includes(item.tour_id))
		];
		const uniqueTours = mergedTours.filter((value, index, self) =>
			index === self.findIndex((t) => t.tour_id === value.tour_id)
		);
		const totalTours = uniqueTours.length;
		const totalPages = Math.ceil(totalTours / 6);
		const startIndex = (page - 1) * 6;
		const paginatedTours = uniqueTours.slice(startIndex, startIndex + 6);
		return { paginatedTours, totalPages }

	},

	searchTours: async (searchQuery) => {
		const query = `SELECT t.tour_id, t.title, t.brief, t.prices, t_i.img_url, t.location_id
					FROM tours t 
					left join tour_images t_i ON t.tour_id = t_i.tour_id 
					WHERE t_i.img_id = 1 AND ($1 = 'default' OR t.title LIKE CONCAT('%', $1, '%')) AND ($1 = 'default' OR t.brief LIKE CONCAT('%', $1, '%'))`;
		const values = [searchQuery];
		try {
			const result = await db.query(query, values); // Remove values here
			return result.rows;
		} catch (err) {
			throw new Error('Error fetching tours by location: ' + err.message);
		}
	},

	filterpriceTours: async (priceQuery) => {
		if (!Array.isArray(priceQuery)) { priceQuery = [priceQuery] }
		const query = `
        SELECT t.tour_id, t.title, t.brief, t.prices, t_i.img_url, t.location_id
        FROM tours t
        LEFT JOIN tour_images t_i ON t.tour_id = t_i.tour_id
        WHERE t_i.img_id = 1
        AND (
			${priceQuery[0]} = -1 or
            ${priceQuery.map((price, index) => `
                (t.prices >= CAST(${price} AS REAL) AND t.prices <= CAST(${price} AS REAL)+99)
                ${index < priceQuery.length - 1 ? 'OR' : ''}
            `).join('')}
        )
    `;
		try {
			const result = await db.query(query); // Remove values here
			return result.rows;
		} catch (err) {
			throw new Error('Error fetching tours by location: ' + err.message);
		}
	},

	filterrateTours: async (rateQuery) => {
		if (!Array.isArray(rateQuery)) { rateQuery = [rateQuery] }
		const query = `
        SELECT t.tour_id, t.title, t.brief, t.prices, t_i.img_url, t.location_id
        FROM tours t
        LEFT JOIN tour_images t_i ON t.tour_id = t_i.tour_id
        WHERE t_i.img_id = 1
        AND (
			${rateQuery[0]} = -1 or
            ${rateQuery.map((rate, index) => `
                (t.rate =  CAST(${rate} AS INT))
                ${index < rateQuery.length - 1 ? 'OR' : ''}
            `).join('')}
        )
    `;
		try {
			const result = await db.query(query); // Remove values here
			return result.rows;
		} catch (err) {
			throw new Error('Error fetching tours by location: ' + err.message);
		}
	},

	filtervoucherTours: async (voucherQuery) => {
		if (!Array.isArray(voucherQuery)) { voucherQuery = [voucherQuery] }
		const query = `
        SELECT t.tour_id, t.title, t.brief, t.prices, t_i.img_url, t.location_id
        FROM tours t
        LEFT JOIN tour_images t_i ON t.tour_id = t_i.tour_id
        WHERE t_i.img_id = 1
        AND (
			${voucherQuery[0]} = -1 or
            ${voucherQuery.map((voucher, index) => `
                (t.voucher >= CAST(${voucher} AS REAL) AND t.voucher <= CAST(${voucher} AS REAL) + 4)
                ${index < voucherQuery.length - 1 ? 'OR' : ''}
            `).join('')}
        )
    `;
		try {
			const result = await db.query(query); // Remove values here
			return result.rows;
		} catch (err) {
			throw new Error('Error fetching tours by location: ' + err.message);
		}
	},

	filterlocationTours: async (locationQuery) => {
		if (!Array.isArray(locationQuery)) { locationQuery = [locationQuery] }
		const query = `
        SELECT t.tour_id, t.title, t.brief, t.prices, t_i.img_url, t.location_id
        FROM tours t
        LEFT JOIN tour_images t_i ON t.tour_id = t_i.tour_id
		left join locations lo on lo.location_id = t.location_id
        WHERE t_i.img_id = 1
        AND (
			'${locationQuery[0]}' like 'default' or
            ${locationQuery.map((location, index) => `
                (lo.location_name like CONCAT('%', '${location}', '%'))
                ${index < locationQuery.length - 1 ? 'OR' : ''}
            `).join('')}
        )
    `;
		try {
			const result = await db.query(query); // Remove values here
			return result.rows;
		} catch (err) {
			throw new Error('Error fetching tours by location: ' + err.message);
		}
	},

	getToursByIDLocation: async (tour_id) => {
		const query = `
			select t.tour_id, t.title, t.brief, t.prices, t_i.img_url, t.location_id
			from tours t inner join tour_images t_i on t.tour_id = t_i.tour_id
					inner join tours c on c.tour_id = $1 and c.location_id = t.location_id
					where  t_i.img_id = 1 and t.tour_id != $1
		`;
		const values = [tour_id];
		try {
			const result = await db.query(query, values);
			return result.rows;
		} catch (err) {
			throw new Error('Error fetching tours by location: ' + err.message);
		}
	},

	getBestdealTours: async () => {
		const query = `
		select t.tour_id, t.title, t.brief, t.prices, t_i.img_url, t.rate,t.voucher, t.location_id
		from tours t inner join locations l on t.location_id = l.location_id
					inner join tour_images t_i on t.tour_id = t_i.tour_id
		where t.rate>=4 and t.voucher>=8 and t_i.img_id = 1
		order by rate DESC
		limit 3
		`;
		try {
			const result = await db.query(query);
			return result.rows;
		} catch (err) {
			throw new Error('Error fetching tours by location: ' + err.message);
		}
	},

	getBestrateTours: async () => {
		const query = `
		select t.tour_id, t.title, t.brief, t.prices, t_i.img_url, t.rate,t.voucher, t.location_id
		from tours t inner join locations l on t.location_id = l.location_id
					inner join tour_images t_i on t.tour_id = t_i.tour_id
		where t.rate>=4 and t.prices<=150.0 and t_i.img_id = 1
		order by rate DESC
		limit 3
		`;
		try {
			const result = await db.query(query);
			return result.rows;
		} catch (err) {
			throw new Error('Error fetching tours by location: ' + err.message);
		}
	},


	getTourByID: async (tour_id) => {
		const query = ` 
		SELECT t.tour_id, t.title, t.brief, t.details, t.prices, t.rate, t.voucher,
		img_urls.img_array,  -- Mảng hình ảnh của tour (gộp riêng trước)
		ARRAY_AGG(
			JSON_BUILD_OBJECT(  -- Gom các chi tiết tour thành một mảng JSON
				'schedule_id', dt.detail_tour_id,
				'status', dt.status,
				'available_quantity',
					CASE
						WHEN (dt.max_quantity - dt.booked_quantity) > 0 THEN (dt.max_quantity - dt.booked_quantity)
						ELSE 0
					END,
				'tour_date', dt.tour_date
			)
		) AS schedules_tour
		FROM tours t
		-- Gom trước các ảnh trong subquery
		LEFT JOIN (
		SELECT tour_id, ARRAY_AGG(img_url) AS img_array
		FROM tour_images
		GROUP BY tour_id
		) img_urls ON t.tour_id = img_urls.tour_id
		-- Join với detail_tours
		LEFT JOIN detail_tours dt ON t.tour_id = dt.tour_id
		WHERE t.tour_id = $1
		GROUP BY t.tour_id, img_urls.img_array
		LIMIT 1;
		`;
		try {
			const result = await db.query(query, [tour_id]);
			// Kiểm tra nếu có kết quả trả về
			if (result.rows[0]) {

				const tourData = result.rows[0];  // Lấy tour đầu tiên trong kết quả trả về
				return {
					tourId: tourData.tour_id,
					title: tourData.title,
					brief: tourData.brief,
					details: tourData.details,
					locationId: tourData.location_id,
					prices: tourData.prices,
					rate: tourData.rate,
					voucher: tourData.voucher,
					imgArray: tourData.img_array || [],
					schedulesTour: tourData.schedules_tour || []
				};

			} else {
				throw new Error('Tour not found');
			}
		} catch (error) {
			console.error(error.message);
			throw error;
		}
	},

	getTourScheduleDetail: async (tourId, scheduleId) => {
		const query = `
		SELECT
			dt.status,
			dt.tour_date,
			GREATEST(dt.max_quantity - dt.booked_quantity, 0) AS available_quantity,
			t.title,
			t.prices,
			t.rate,
			ti.img_url AS first_image
		FROM detail_tours dt
		JOIN tours t ON t.tour_id = dt.tour_id
		LEFT JOIN tour_images ti ON ti.tour_id = t.tour_id
		WHERE dt.tour_id = $1 AND dt.detail_tour_id = $2
		ORDER BY ti.img_id LIMIT 1;
        `;
		try {
			const result = await db.query(query, [tourId, scheduleId]);
			if (result.rows.length > 0) {

				const tourDetails = result.rows[0];
				return {
					status: tourDetails.status,
					tourDate: tourDetails.tour_date,
					availableQuantity: tourDetails.available_quantity,
					title: tourDetails.title,
					prices: tourDetails.prices,
					rate: tourDetails.rate,
					firstImage: tourDetails.first_image
				};

			}
			return null; // Nếu không tìm thấy, trả về null
		} catch (error) {
			console.error("Error getTourScheduleDetail in tourModel :", error);
			throw new Error("Error fetching tour details");
		}
	},

};

module.exports = Tour;