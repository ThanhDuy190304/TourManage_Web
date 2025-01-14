const reservationService = require('./reservationService');
const userService = require('../user/userService');
const crypto = require('crypto');
const https = require('https');
require('dotenv').config();

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
            res.status(500).json({
                message: "Order error, please try again."
            });
        }
    }

    static async confirmReservation(req, res) {
        try {
            const user = res.locals.user;
            if (!user) {
                return res.status(401);
            }
            const { userFullName, userContact, payMethod, reservationDataArray, totalAmount } = req.body;
            if (!userFullName || !userContact || !reservationDataArray || !payMethod || !totalAmount) {
                return res.status(400).json({
                    message: "Invalid request."
                });
            }
            let reservationArray = Array.isArray(reservationDataArray) ? reservationDataArray : JSON.parse(reservationDataArray);
            let touristId = await userService.getTouristId(user.userId);

            // Chuyển totalAmount sang định dạng phù hợp với MoMo
            var p = parseFloat(totalAmount);
            p = p * 23000;  // Giả sử đây là tỉ lệ quy đổi

            const ENV_URL = process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000'
                : process.env.PRODUCTION_URL;  // URL production

            
            //payonline khung dien ne
            if (payMethod === 'payOnline') {
                // Các thông tin liên quan đến MoMo API
                var partnerCode = "MOMO";
                var accessKey = "F8BBA842ECF85";
                var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
                var requestId = partnerCode + new Date().getTime();
                var orderId = requestId;
                var orderInfo = "pay with MoMo";
                var redirectUrl = ENV_URL;
                var ipnUrl = "https://callback.url/notify";
                var amount = p;
                var requestType = "captureWallet";
                var extraData = "";  // Dữ liệu bổ sung, nếu có

                // Tạo chữ ký HMAC SHA256
                var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;

                const signature = crypto.createHmac('sha256', secretkey)
                    .update(rawSignature)
                    .digest('hex');

                // Tạo body request gửi đến MoMo API
                const requestBody = JSON.stringify({
                    partnerCode: partnerCode,
                    accessKey: accessKey,
                    requestId: requestId,
                    amount: amount,
                    orderId: orderId,
                    orderInfo: orderInfo,
                    redirectUrl: redirectUrl,
                    ipnUrl: ipnUrl,
                    extraData: extraData,
                    requestType: requestType,
                    signature: signature,
                    lang: 'en'
                });

                // Tạo yêu cầu HTTPS gửi đến MoMo API
                const options = {
                    hostname: 'test-payment.momo.vn',
                    port: 443,
                    path: '/v2/gateway/api/create',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(requestBody)
                    }
                };

                let responseJsonMOMO;
                const momoReq = https.request(options, momoRes => {
                    let responseData = '';

                    momoRes.on('data', chunk => {
                        responseData += chunk;
                    });
                    
                    momoRes.on('end', () => {
                        responseJsonMOMO = JSON.parse(responseData);
                        if (responseJsonMOMO.resultCode === 0) {
                            // Nếu API trả về thành công, lấy URL thanh toán
                            const payUrl = responseJsonMOMO.payUrl;
                            // Chuyển hướng người dùng đến MoMo để thanh toán
                            return res.redirect(payUrl);
                        } else {
                            // Nếu có lỗi từ MoMo API
                            console.log("ngu");  // In ra thông báo "ngu"
                            console.error("MoMo API Error:", responseJsonMOMO);  // In ra chi tiết lỗi từ MoMo API
                            return res.status(500).json({
                                message: "Failed to get payment URL from MoMo.",
                                errorDetails: responseJsonMOMO  // Trả về chi tiết lỗi từ MoMo API
                            });
                        }
                    });
                });

                momoReq.on('error', (e) => {
                    // In ra thông báo "ngu" nếu có lỗi kết nối
                    console.log("ngu");  // Thêm dòng này để thông báo khi có lỗi
                    console.log(`Problem with request: ${e.message}`);
                    return res.status(500).json({
                        message: "Failed to communicate with MoMo API."
                    });
                });

                // Gửi dữ liệu đến MoMo API
                momoReq.write(requestBody);
                momoReq.end();

                if(responseJsonMOMO !=0){
                    return;
                }
            }

            console.log('ok');

            await reservationService.confirmReservation(touristId, userFullName, userContact, payMethod, reservationArray);

            res.render('reservationSucessfully', {
                layout: false
            });

        } catch (error) {
            console.error("Error in confirmReservation:", error.message);
            res.status(500).json({
                message: "Order error, please try again."
            });
        }
    }
}

module.exports = reservationController;
