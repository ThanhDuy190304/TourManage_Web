const jwt = require('jsonwebtoken');
const { refreshAccessToken } = require('../modules/auth/authController');
require('dotenv').config();

/**
 * Middleware để xác thực token từ cookie.
 */
async function authenticateToken(req, res, next) {
    const accessToken = req.cookies[process.env.ACCESS_TOKEN_NAME];
    const refreshToken = req.cookies[process.env.REFRESH_TOKEN_NAME];
    if (accessToken) {
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            res.locals.user = decoded;
            if (res.locals.user.userRole === 1) {
                return res.redirect('/admin'); // Kết thúc ở đây nếu redirect
            }
            return next();
        } catch (err) {
            console.log('Access token expired, trying to refresh:', err.message);
            if (refreshToken) {
                try {
                    await refreshAccessToken(req, res, next);
                    return;
                } catch (refreshErr) {
                    console.log("Error refreshing token:", refreshErr.message);
                }
            }
            res.locals.user = null;
            res.clearCookie(process.env.ACCESS_TOKEN_NAME, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
            });
        }
    }

    if (!res.locals.user && refreshToken) {
        try {
            await refreshAccessToken(req, res, next);
            return;
        } catch (refreshErr) {
            console.log("Error refreshing token:", refreshErr.message);
        }
    }

    // Nếu không có accessToken hoặc refreshToken hoặc tất cả đều thất bại
    res.locals.user = null;
    return next();
}



/**
 * Middleware yêu cầu người dùng phải đăng nhập.
 */
function requireAuth(req, res, next) {
    if (!res.locals.user) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    next();
}

function checkout(req, res, next) {
    if (res.locals.user) {
        return res.redirect('/');
    }
    return next();
}

module.exports = {
    authenticateToken,
    requireAuth,
    checkout,
};
