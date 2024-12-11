const db = require('../../config/db');

class reservationModel {
    static async createReservation(touristId) {
        try {
            const query = `insert into reservations(tourist_id, status) values ($1, 'reserved') returning reservation_id`;
            const result = await db.query(query, [touristId]);
            if (result.rows.length > 0) {
                return result.rows[0].reservation_id;
            }
        } catch (error) {
            console.error("Error createReservation in reservationModel:", error);
            throw new Error("Error createReservation in reservationModel");
        }
    }

    static async insertReservationDetail(reservationId, tourId, scheduleId, quantity, total_price, title, tourDate) {
        try {
            const query = `
            INSERT INTO detail_reservations 
                (reservation_id, tour_id, detail_tour_id, quantity, total_price, tittle, tourdate) 
            VALUES 
                ($1, $2, $3, $4, $5, $6, $7)
            `;
            await db.query(query, [
                reservationId,
                tourId,
                scheduleId,
                quantity,
                total_price,
                title,
                tourDate
            ]);

        } catch (error) {
            console.error("Error insertReservationDetail in reservationModel:", error);
            throw new Error("Error insertReservationDetail in reservationModel");
        }
    }

    static async getReservationIdByTouristId(touristId) {
        try {
            const query = `
                select reservation_id, reservation_date from reservations where tourist_id = $1;
            `
            const result = await db.query(query, [touristId]);
            if (result.rows.length > 0) {
                return result.rows.map(row => ({
                    reservationId: row.reservation_id,
                    reservationDate: row.reservation_date,
                }));
            } else {
                return null;
            }

        } catch (error) {
            console.error("Error fetching reservation by touristId:", error);
            throw new Error("Unable to fetch reservation data.");
        }
    }
    static async getDetailReservationById(reservationId) {
        try {
            const query = `SELECT tour_id, quantity, total_price, tittle AS tourTitle, tourdate 
                       FROM detail_reservations 
                       WHERE reservation_id = $1;`;
            const result = await db.query(query, [reservationId]);
            return result.rows.map(row => ({
                tourId: row.tour_id,
                quantity: row.quantity,
                totalPrice: row.total_price,
                title: row.tourtitle,
                tourDate: row.tourdate,
            }));
        } catch (error) {
            console.error("Error fetching reservation details:", error);
            throw new Error("Unable to fetch reservation details.");
        }
    }



}
module.exports = reservationModel;