require('dotenv').config();
const passport = require("../../config/passportConfig");
const { generateAccessToken, generateRefreshToken } = require("../../utils/generateTokensUtils");
const loginModel = require("./loginModel");
const { getDeviceId } = require("../../utils/deviceID")


class loginController {
    // Phương thức xử lý đăng nhập
    static async loginUser(req, res) {
        // Sử dụng passport để xác thực người dùng
        passport.authenticate('local', { session: false }, async (err, user, info) => {
            if (err) {
                return res.status(500).json({ message: 'Authentication failed.', error: err.message });
            }

            if (!user) {
                return res.render('login', {
                    message: info.message,
                    layout: false,
                    title: 'Login Page'
                });
            }

            try {
                const device_id = getDeviceId(req); // Lấy device_id từ request

                const accessToken = generateAccessToken(user.getId(), user.getUserName(), user.getRole(), device_id);
                const refreshToken = generateRefreshToken(user.getId(), user.getUserName(), user.getRole(), device_id);
                loginModel.saveRefreshToken(user.getId(), refreshToken, device_id);

                res.cookie(process.env.ACCESS_TOKEN_NAME, accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
                res.cookie(process.env.REFRESH_TOKEN_NAME, refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
                res.redirect('/');

            } catch (error) {
                res.status(500).json({ message: 'Error creating tokens', error: error.message });
            }
        })(req, res);
    }
}

module.exports = loginController;
