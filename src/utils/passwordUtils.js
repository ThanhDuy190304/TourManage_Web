const crypto = require('crypto');

// Tạo một salt ngẫu nhiên
function generateSalt() {
    return crypto.randomBytes(16).toString('hex');
}
// Hàm để tạo hash mật khẩu với salt
function hashPassword(password, salt) {

    const hash = crypto.createHmac('sha256', salt); // Dùng SHA256 để mã hóa
    hash.update(password);
    return hash.digest('hex');
}

// Export hàm hashPassword để sử dụng ở nơi khác
module.exports = {
    generateSalt,
    hashPassword
};
