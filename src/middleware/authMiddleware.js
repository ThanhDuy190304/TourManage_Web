const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {

    const token = req.cookies.auth_token; // Lấy token từ cookie
    if (!token) {
        res.locals.user = null; // Không có token, gán user là null
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token
        res.locals.user = decoded; // Gắn thông tin người dùng vào `res.locals`
    } catch (err) {
        res.locals.user = null; // Token không hợp lệ
    }

    next();
}

module.exports = authenticateToken;
