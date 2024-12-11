const jwt = require('jsonwebtoken');
require('dotenv').config();

// Hàm tạo accessToken
const generateAccessToken = (userId, userName, userRole, deviceId) => {
    return jwt.sign(
        { userId, userName, userRole, deviceId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
    );
};

// Hàm tạo refreshToken
const generateRefreshToken = (userId, userName, userRole, deviceId) => {
    return jwt.sign(
        { userId, userName, userRole, deviceId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
    );
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
};
