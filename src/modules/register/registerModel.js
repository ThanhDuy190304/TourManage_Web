const db = require('../../config/db');

class registerModel {
    // Chèn người dùng mới vào bảng pending_users
    static async createPendingUser(userName, email, encryptionPassword, salt, verificationToken) {
        const query = 'INSERT INTO pending_users (user_name, email, user_password, verification_token, salt) VALUES ($1, $2, $3, $4, $5)';
        await db.query(query, [userName, email, encryptionPassword, verificationToken, salt]);
    }

}

module.exports = registerModel;
