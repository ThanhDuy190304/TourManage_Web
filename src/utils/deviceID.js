
// Middleware để lấy IP của người dùng
function getDeviceId(userAgent) {
    return hashDeviceId(userAgent);
}

// Hàm băm device_id
function hashDeviceId(rawDeviceId) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(rawDeviceId).digest('hex');
}
module.exports = {
    getDeviceId,
};
