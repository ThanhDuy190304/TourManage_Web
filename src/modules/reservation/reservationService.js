const userModel = require('../user/userModel');
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
}

module.exports = reservationService;
