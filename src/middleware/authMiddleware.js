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
                return res.redirect('/admin');
            }

            return next();
        } catch (err) {
            console.log(err.message);
            res.clearCookie(process.env.ACCESS_TOKEN_NAME, { httpOnly: true, path: '/' });
        }
    }

    if (refreshToken) {
        await refreshAccessToken(req, res, next);

    } else {
        res.locals.user = null;
        return next();
    }
}


/**
 * Middleware yêu cầu người dùng phải đăng nhập.
 */
function requireAuth(req, res, next) {
    if (!res.locals.user) {
        return res.redirect('/login');
    }
    return next();
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
