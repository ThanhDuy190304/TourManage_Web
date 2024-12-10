const reservationService = require('./reservationService');
const userModel = require('../user/userModel');

class reservationController {
    static async showInvoices(req, res) {
        try {
            const user = res.locals.user;
            const reservationDataArray = req.query.reservationDataArray;
            let reservationArray = Array.isArray(reservationDataArray) ? reservationDataArray : JSON.parse(reservationDataArray);

            let userProfile = null;

            // Lấy thông tin người dùng nếu có userId
            if (user) {
                userProfile = await userModel.getProfileUser(user.userId);
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
            // Log lỗi chi tiết
            console.error("Error in showInvoices:", error);
            // Trả về lỗi chung cho người dùng
            return res.status(500).json({
                message: 'Order error, please try again.'
            });
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
            await reservationService.confirmReservation(user.userId, reservationArray);
            res.render('reservationSucessfully', {
                layout: false
            });
        } catch (error) {
            console.error("Error in confirmReservation:", error);
            return res.status(500).json({
                message: 'Order error, please try again.'
            });
        }
    }
}

module.exports = reservationController;
