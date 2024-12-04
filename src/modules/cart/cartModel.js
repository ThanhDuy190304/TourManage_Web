const db = require('../../config/db'); // Giả sử bạn có một tệp db.js để kết nối với cơ sở dữ liệu

const cartModel = {

	getNextCartItem: async () => {
		const query = `
		SELECT 
            'i' || LPAD(CAST(COALESCE(MAX(CAST(SUBSTRING(cart_item_id FROM 3) AS INT)), 0) + 1 AS VARCHAR), 3, '0') AS next_cart_item_id
        FROM cart_items;
		`;
		try {
			const result = await db.query(query);
			return result.rows;
		} catch (err) {
			throw new Error('Error fetching tours by location: ' + err.message);
		}
	},

	getNextRID: async () => {
		const query = `
		SELECT 
            'r' || LPAD(CAST(COALESCE(MAX(CAST(SUBSTRING(reservation_id FROM 3) AS INT)), 0) + 1 AS VARCHAR), 3, '0') AS next_reservationID
        FROM reservations;
		`;
		try {
			const result = await db.query(query);
			return result.rows;
		} catch (err) {
			throw new Error('Error fetching tours by location: ' + err.message);
		}
	},

	getNextRDID: async () => {
		const query = `
		SELECT 
            'h' || LPAD(CAST(COALESCE(MAX(CAST(SUBSTRING(reservation_id FROM 3) AS INT)), 0) + 1 AS VARCHAR), 3, '0') AS next_reservation_detail_ID
        FROM detail_reservations;
		`;
		try {
			const result = await db.query(query);
			return result.rows;
		} catch (err) {
			throw new Error('Error fetching tours by location: ' + err.message);
		}
	},


	getCartItemByUserID: async (user_id) => {
		const query = `
		SELECT ci.tour_id, ci.quantity, ci.price
		from carts c
		join cart_items ci on c.cart_id = ci.cart_id
		join tourists t on t.tourist_id = c.tourist_id
		join users u on t.user_id = u.user_id and u.user_id = '${user_id}'
		`;
		try {
			const result = await db.query(query);
			return result.rows;
		} catch (err) {
			throw new Error('Error fetching tours by location: ' + err.message);
		}
	},
	deleteCartItem: async (user_id, tour_id) => {
		const query = `
		DELETE FROM cart_items
		WHERE cart_id = (SELECT c.cart_id
		FROM carts c
		join tourists t on c.tourist_id=t.tourist_id
		join users u on u.user_id = t.user_id
		WHERE u.user_id = '${user_id}'
		) AND tour_id ='${tour_id}'
		`;
		try {
			await db.query(query);
		} catch (err) {
			throw new Error('Error fetching tours by location: ' + err.message);
		}
	},

	updateCartItem: async (user_id, tour_id,quantity, price) => {
		const query = `
		UPDATE cart_items
		SET quantity = ${quantity}, price = ${price}
		WHERE cart_id = (
		SELECT c.cart_id
		FROM carts c
		join tourists t on c.tourist_id=t.tourist_id
		join users u on u.user_id = t.user_id
		WHERE u.user_id = '${user_id}'
		) AND tour_id = '${tour_id}';
		`;
		try {
			await db.query(query);
		} catch (err) {
			throw new Error('Error fetching tours by location: ' + err.message);
		}
	},
	addReservation: async (reservationID,userID) => {
		const query = `
		INSERT INTO reservations (reservation_id, tourist_id, reservation_date, status)
		VALUES ('${reservationID}', (SELECT t.tourist_id
			FROM users u
			join tourists t on u.user_id = t.user_id
			WHERE u.user_id = '${userID}'
			), NOW(), 'waiting');
		`;
		console.log(query)
		try {
			await db.query(query);
		} catch (err) {
			throw new Error('Error fetching tours by location: ' + err.message);
		}
	},

	addReservationDetail: async (reservationID, detailReservationID,userID,tourID,quantity, price,detailTourId) => {
		const query = `
		DELETE FROM cart_items
		WHERE cart_id = (SELECT c.cart_id
		FROM carts c
		join tourists t on c.tourist_id=t.tourist_id
		join users u on u.user_id = t.user_id
		WHERE u.user_id = '${userID}'
		) AND tour_id ='${tourID}';

		INSERT INTO detail_reservations (detail_reservation_id, reservation_id, tour_id, quantity, price, id_detail)
		VALUES ('${detailReservationID}', '${reservationID}', '${tourID}',${quantity}, ${price},'${detailTourId}');
		`;
		console.log(query)
		try {
			await db.query(query);
		} catch (err) {
			throw new Error('Error fetching tours by location: ' + err.message);
		}
	},

	addCartItem: async (nextCIID, CartID,TourID,quantity, price) => {
		const query = `
		INSERT INTO cart_items (cart_item_id, cart_id, tour_id, quantity, price)
		VALUES ('${nextCIID}', '${CartID}', '${TourID}',${quantity}, ${price})
		`;
		try {
			await db.query(query);
		} catch (err) {
			throw new Error('Error fetching tours by location: ' + err.message);
		}
	},
	getCartByUserid: async (user_id) => {
		const query = `
		SELECT c.cart_id, c.items_count
		from carts c
		join tourists t on t.tourist_id = c.tourist_id
		join users u on t.user_id = u.user_id and u.user_id = '${user_id}'
		`;
		try {
			const result = await db.query(query);
			return result.rows;
		} catch (err) {
			throw new Error('Error fetching tours by location: ' + err.message);
		}
	},
};

module.exports = cartModel;