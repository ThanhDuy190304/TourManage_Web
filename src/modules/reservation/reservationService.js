const userModel = require('../user/userModel');
const reservationModel = require('./reservationModel');
const db = require("../../config/db");

class reservationService {
    static calculateInvoice(reservationDataArray) {
        let subtotal = 0;
        const invoiceItems = reservationDataArray.map(item => {
            const amountBeforeVoucher = item.prices * item.quantity;
            const discountAmount = (item.voucher / 100) * amountBeforeVoucher;
            const amountAfterVoucher = amountBeforeVoucher - discountAmount;

            subtotal += amountAfterVoucher;

            return {
                tourName: item.title,
                tourDate: item.tourDate,
                quantity: item.quantity,
                price: item.prices,
                voucher: item.voucher,
                amountAfterVoucher: amountAfterVoucher.toFixed(2),  // Đảm bảo format số tiền
            };
        });

        return { invoiceItems, subtotal };
    }

    static async confirmReservation(userId, reservationDataArray) {
        const client = await db.connect();
        try {
            await client.query('BEGIN');
            let touristId = await userModel.getTouristId(userId);
            let reservationId = await reservationModel.createReservation(touristId);
            for (let data of reservationDataArray) {
                const { tourId, scheduleId, quantity, prices, title, tourDate, voucher } = data;

                const total_price = prices * (voucher / 100) * quantity;
                await reservationModel.insertReservationDetail(
                    reservationId,
                    tourId,
                    scheduleId,
                    quantity,
                    total_price,
                    title,
                    tourDate
                );
            }
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            console.error("Error in confirmReservation in reservationService:", error);
            throw new Error(`Failed confirm the reservation`);
        } finally {
            client.release();  // Giải phóng kết nối sau khi xong
        }

    }
}

module.exports = reservationService;
