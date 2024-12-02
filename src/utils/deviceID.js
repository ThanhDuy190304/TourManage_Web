const requestIp = require('request-ip');

// Middleware để lấy IP của người dùng
function getDeviceId(req) {

    const ip = requestIp.getClientIp(req); // Lấy IP của người dùng
    const userAgent = req.headers['user-agent']; // Lấy thông tin user-agent từ headers

    // Tạo device_id bằng cách kết hợp IP và user-agent rồi băm
    const rawDeviceId = `${ip}-${userAgent}`;
    return hashDeviceId(rawDeviceId);
}

// Hàm băm device_id
function hashDeviceId(rawDeviceId) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(rawDeviceId).digest('hex');
}
module.exports = {
    getDeviceId,
};