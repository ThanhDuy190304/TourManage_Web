const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.cookies.auth_token; // Lấy token từ cookie
    if (!token) {
        req.user = null; // Không có người dùng
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token
        req.user = decoded; // Gắn thông tin người dùng vào req.user
        next();
    } catch (err) {
        req.user = null; // Token không hợp lệ
        next();
    }
}

module.exports = authenticateToken;
