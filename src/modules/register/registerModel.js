const db = require('../../config/db');
const crypto = require('crypto');
const userModel = require('../user/userModel');
const { sendVerificationEmail } = require('../../utils/emailUtils');

require('dotenv').config();

class registerModel {

    // Hàm kiểm tra tài khoản đã tồn tại
    static async #checkUserExists(userName, email) {
        const [existingUsers, pendingUsers] = await Promise.all([
            userModel.checkUserExistsInUsers(userName, email),
            userModel.checkUserExistsInPendingUsers(userName, email)
        ]);

        if (existingUsers) {
            throw new Error('Username or Email already exists.');
        }
        if (pendingUsers) {
            throw new Error('This username or email is already registered and awaiting email verification. Please check your email to verify your account.');
        }
    }

    // Hàm đăng ký tài khoản
    static async registerUser(userName, email, encryptionPassword, salt) {
        try {

            await registerModel.#checkUserExists(userName, email);

            // Tạo token xác thực
            const verificationToken = crypto.randomBytes(20).toString('hex');

            // Chèn người dùng mới vào bảng pending_users
            const query = 'INSERT INTO pending_users (user_name, email, user_password, verification_token, salt) VALUES ($1, $2, $3, $4, $5)';
            await db.query(query, [userName, email, encryptionPassword, verificationToken, salt]);

            // Gửi email xác thực
            await sendVerificationEmail(email, verificationToken);

        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = registerModel;
