const reservationModel = require('./reservationModel');
const db = require("../../config/db");

const { format, parse } = require('date-fns');
const { vi } = require('date-fns/locale');


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

    static async confirmReservation(touristId, userFullName, userContact, payMethod, reservationDataArray) {
        const client = await db.connect();
        try {
            await client.query('BEGIN');
            let status = 'reserved';
            if (payMethod === 'payByCash') {
                status = 'waiting';
            }
            else if (payMethod === 'payOnline') {
                status = 'reserved';
            }
            let reservationId = await reservationModel.createReservation(touristId, status, client);

            for (let data of reservationDataArray) {
                const { tourId, scheduleId, quantity, prices, title, tourDate, voucher, img } = data;

                const total_price = prices * (voucher / 100) * quantity;
                const formattedTourDate = format(parse(tourDate, 'dd-MM-yyyy', new Date()), 'yyyy-MM-dd');

                await reservationModel.insertReservationDetail(
                    reservationId,
                    tourId,
                    scheduleId,
                    quantity,
                    total_price,
                    title,
                    formattedTourDate,
                    userFullName,
                    userContact,
                    img,
                    client
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
    static async getReservationByUserId(touristId) {
        try {
            let reservationArray = await reservationModel.getReservationIdByTouristId(touristId);
            if (!reservationArray || reservationArray.length === 0) {
                return [];
            }
            const reservationPromises = reservationArray.map(reservation =>
                reservationModel.getDetailReservationById(reservation.reservationId)
                    .then(details => ({
                        reservationId: reservation.reservationId,
                        reservationDate: format(new Date(reservation.reservationDate), 'dd-MM-yyyy', { locale: vi }),
                        reservationStatus: reservation.status === 'reserved' ? 'Paid' : 'Unpaid',
                        details: details.map(detail => {
                            const parsedDate = format(detail.tourDate, 'dd-MM-yyyy', { locale: vi });
                            return {
                                tourId: detail.tourId,
                                quantity: detail.quantity,
                                totalPrice: detail.totalPrice,
                                title: detail.title,
                                img: detail.img,
                                tourDate: parsedDate
                            };
                        })
                    }))
            );
            const detailedReservations = await Promise.all(reservationPromises);
            return detailedReservations;
        } catch (error) {
            console.error("Error fetching reservations in reservationService:", error.message);
            throw error;
        }
    }
}

module.exports = reservationService;
