const passport = require("../../config/passportConfig");
const loginService = require("./loginService");
const cartService = require("../cart/cartService");
require('dotenv').config();
const { getDeviceId } = require("../../utils/deviceID")


class loginController {
    // Phương thức xử lý đăng nhập
    static async loginUser(req, res) {
        // Sử dụng passport để xác thực người dùng
        passport.authenticate('local', { session: false }, async (err, user, info) => {
            if (err) {
                console.error("Error during authentication:", err.message);
                return res.status(500).json({ message: 'Authentication failed. Please try again later.' });
            }

            if (!user) {
                return res.render('login', {
                    message: info.message,
                    layout: false,
                    title: 'Login Page'
                });
            }
            try {

                const cartDataArray = req.body.cartDataArray;
                if (cartDataArray.length > 0) {
                    await cartService.syncCartWithDB(user.userId, cartDataArray);
                }
                let countItem = await cartService.getItemCountsOfUserCart(user.userId);

                const userAgent = req.headers['user-agent']; // Lấy thông tin user-agent từ headers
                const deviceId = getDeviceId(userAgent);

                const { accessToken, refreshToken } = await loginService.authenticateUser(user.userId, user.userName, user.roleId, deviceId);

                res.cookie(process.env.ACCESS_TOKEN_NAME, accessToken, {
                    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict'
                });
                res.cookie(process.env.REFRESH_TOKEN_NAME, refreshToken, {
                    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict'
                });

                return res.status(200).json({
                    countItem: countItem,
                });


            } catch (error) {
                console.error("Error in loginController:", error.message); // In ra để debug
                res.status(500).json({ message: 'Failed to log in. Please try again later.' });
            }
        })(req, res);
    }
}

module.exports = loginController;
