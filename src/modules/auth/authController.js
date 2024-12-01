const { getRefreshTokenFromDb } = require('./authModel');
const { generateAccessToken } = require('../../utils/generateTokensUtils');

async function refreshAccessToken(req, res, next) {
    const refreshToken = req.cookies[process.env.REFRESH_TOKEN_NAME];
    if (!refreshToken) {
        return next();
    }
    try {
        const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        // Kiểm tra refreshToken từ DB
        const storedRefreshToken = await getRefreshTokenFromDb(refreshToken);

        if (storedRefreshToken) {
            // Tạo lại access token nếu refresh token hợp lệ
            const newAccessToken = generateAccessToken(decodedRefreshToken.user_id, decodedRefreshToken.user_name
                .decodedRefreshToken.user_role);

            // Cập nhật cookie với access token mới
            res.cookie(accessTokenName, newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            res.locals.user = decodedRefreshToken;
        } else {
            res.locals.user = null;
        }

    } catch (err) {
        res.clearCookie(process.env.ACCESS_TOKEN_NAME);
        res.clearCookie(process.env.REFRESH_TOKEN_NAME);
        res.locals.user = null;
    }
    next();
}

module.exports = { refreshAccessToken };
