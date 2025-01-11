// middleware/rateLimitMiddleware.js
const rateLimit = require('express-rate-limit');

// Middleware giới hạn số yêu cầu
const rateLimitMiddleware = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100, // Cho phép 100 yêu cầu trong 15 phút
    message: {
        message: "Too many requests from this IP, please try again after 15 minutes"
    },
    headers: true, // Hiển thị header 'X-RateLimit-*'
});

module.exports = rateLimitMiddleware;
