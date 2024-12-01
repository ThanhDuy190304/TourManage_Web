const jwt = require('jsonwebtoken');
require('dotenv').config();

// Hàm tạo accessToken
const generateAccessToken = (user_id, user_name, user_role, device_id) => {
    return jwt.sign(
        { user_id, user_name, user_role, device_id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
    );
};

// Hàm tạo refreshToken
const generateRefreshToken = (user_id, user_name, user_role, device_id) => {
    return jwt.sign(
        { user_id, user_name, user_role, device_id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
    );
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
};
