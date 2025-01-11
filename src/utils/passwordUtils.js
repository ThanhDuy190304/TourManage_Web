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

function validatePassword(password) {
    const regex = /(?=^.{8,}$)(?=.*[_!@#$%^&*-])(?=.*\d)(?=.*[^\w_])(?![.\n])(?=.*[a-z])(?=.*[A-Z]).*$/;
    const isValid = regex.test(password);

    return {
        valid: isValid,
        message: isValid
            ? 'Password is valid.'
            : 'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one special character (_!@#$%^&*-)'
    };
}

function generateRandomPassword() {
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
    let password = '$'; // Bắt đầu với ký tự '$'
    // Random 2 chữ thường
    for (let i = 0; i < 2; i++) {
        password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
    }
    // Random 3 chữ số
    for (let i = 0; i < 3; i++) {
        password += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    // Random 2 chữ hoa
    for (let i = 0; i < 2; i++) {
        password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
    }
    // Trộn ngẫu nhiên mật khẩu (trừ ký tự đầu tiên `$`)
    password = password[0] + password.slice(1).split('').sort(() => Math.random() - 0.5).join('');
    return password;
}


// Export hàm hashPassword để sử dụng ở nơi khác
module.exports = {
    generateSalt,
    hashPassword,
    validatePassword,
    generateRandomPassword,
};
