const db = require('../../config/db');
const crypto = require('crypto');
const userModel = require('../shared/userModel');
const { sendVerificationEmail } = require('../../utils/emailUtils');

require('dotenv').config();


// Hàm kiểm tra tài khoản đã tồn tại
async function checkUserExists(userName, email) {

    const [existingUsers, pendingUsers] = await Promise.all([
        userModel.checkUserExistsInUsers(userName, email),
        userModel.checkUserExistsInPendingUsers(userName, email)
    ]);

    if (existingUsers.length > 0) {
        throw new Error('Username or Email already exists.');
    }
    if (pendingUsers.length > 0) {
        throw new Error('This username or email is already registered and awaiting email verification.\
         Please check your email to verify your account.');
    }
}

// Hàm đăng ký tài khoản
async function registerUser(userName, email, encryptionPassword, salt) {
    try {

        await checkUserExists(userName, email);

        // Tạo token xác thực
        const verificationToken = crypto.randomBytes(20).toString('hex');

        // Chèn người dùng mới vào bảng pending_users
        const query = 'INSERT INTO pending_users (user_name, email, user_password, verification_token, salt) VALUES ($1, $2, $3, $4, $5)';
        await db.query(query, [userName, email, encryptionPassword, verificationToken, salt]);

        // Gửi email xác thực
        sendVerificationEmail(email, verificationToken);


    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    registerUser,
};
