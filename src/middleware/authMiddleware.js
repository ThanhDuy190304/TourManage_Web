const jwt = require('jsonwebtoken');
const { refreshAccessToken } = require('../modules/auth/authController');

require('dotenv').config();

/**
 * Middleware để xác thực token từ cookie.
 */
async function authenticateToken(req, res, next) {
    const accessToken = req.cookies[process.env.ACCESS_TOKEN_NAME];
    if (!accessToken) {
        res.locals.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        res.locals.user = decoded;
        return next();
    } catch (err) {
        await refreshAccessToken(req, res, next);
    }
    next();
}

/**
 * Middleware yêu cầu người dùng phải đăng nhập.
 */
function requireAuth(req, res, next) {
    if (!res.locals.user) {
        return res.redirect('/login');
    }
    next();
}

function checkout(req, res, next) {
    if (res.locals.user) {
        return res.redirect('/');
    }
    next();
}

module.exports = {
    authenticateToken,
    requireAuth,
    checkout,
};
