const reservationService = require('./reservationService');
const userService = require('../user/userService');

class reservationController {
    static async showInvoices(req, res) {
        try {
            const user = res.locals.user;
            const reservationDataArray = req.query.reservationDataArray;
            let reservationArray = Array.isArray(reservationDataArray) ? reservationDataArray : JSON.parse(reservationDataArray);

            let userProfile = null;

            // Lấy thông tin người dùng nếu có userId
            if (user) {
                userProfile = await userService.getPublicProfile(user.userId);
            }

            // Tính toán invoice bằng service
            const { invoiceItems, subtotal } = reservationService.calculateInvoice(reservationArray);

            const currentDate = new Date().toLocaleDateString();
            res.render('reservation', {
                title: "Reservation",
                invoiceItems: invoiceItems,
                total: subtotal.toFixed(2),
                userProfile: userProfile,
                invoiceDate: currentDate,
            });

        } catch (error) {
            return next(new AppError("Order error, please try again.", 500));
        }
    }

    static async confirmReservation(req, res) {
        try {
            const user = res.locals.user;
            if (!user) {
                return res.status(401);
            }
            const { reservationDataArray } = req.body;
            let reservationArray = Array.isArray(reservationDataArray) ? reservationDataArray : JSON.parse(reservationDataArray);
            let touristId = await userService.getTouristId(user.userId);
            await reservationService.confirmReservation(touristId, reservationArray);
            res.render('reservationSucessfully', {
                layout: false
            });
        } catch (error) {
            return next(new AppError("Order error, please try again.", 500));
        }
    }
}

module.exports = reservationController;
