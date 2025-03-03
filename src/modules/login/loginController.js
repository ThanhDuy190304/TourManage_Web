const passport = require("../../config/passportConfig");
const loginService = require("./loginService");
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
                return res.status(401).json({ message: info.message });
            }
            try {
                const userAgent = req.headers['user-agent']; // Lấy thông tin user-agent từ headers
                const deviceId = getDeviceId(userAgent);
                const { accessToken, refreshToken } = await loginService.authenticateUser(user.userId, user.userName, user.roleId, deviceId);
                if (user.roleId === 1) {
                    res.cookie(process.env.ACCESS_TOKEN_NAME, accessToken, {
                        httpOnly: true, secure: process.env.NODE_ENV === 'production',
                        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
                        path: '/',
                        domain: process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_DOMAIN : 'localhost',
                    });
                    res.cookie(process.env.REFRESH_TOKEN_NAME, refreshToken, {
                        httpOnly: true, secure: process.env.NODE_ENV === 'production',
                        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
                        path: '/',
                        domain: process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_DOMAIN : 'localhost',
                    });
                    const adminPath = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : process.env.ADMIN_PATH;
                    return res.status(200).json({ redirect: adminPath });
                }
                res.cookie(process.env.ACCESS_TOKEN_NAME, accessToken, {
                    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict',
                    path: '/',
                });
                res.cookie(process.env.REFRESH_TOKEN_NAME, refreshToken, {
                    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict',
                    path: '/',
                });
                return res.status(200).json({ message: 'Login successful' });
            } catch (error) {
                console.error("Error in loginController:", error.message); // In ra để debug
                res.status(500).json({ message: 'Failed to log in. Please try again later.' });
            }
        })(req, res);
    }
}

module.exports = loginController;
