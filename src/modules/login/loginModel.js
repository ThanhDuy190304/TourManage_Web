const db = require('../../config/db');

class LoginModel {
    /**
     * Lưu refresh token vào cơ sở dữ liệu.
     * @param {string} userId 
     * @param {string} refreshToken 
     * @param {string} deviceID
     */
    static async saveRefreshToken(userId, refreshToken, deviceID) {
        try {
            const query = 'INSERT INTO refresh_tokens (user_id, token, device_ID) VALUES ($1, $2, $3) ON CONFLICT (user_id, device_ID) DO UPDATE SET token = $2';
            await db.query(query, [userId, refreshToken, deviceID]);
        } catch (error) {
            throw new Error('Failed to save refresh token');
        }
    }
}
module.exports = LoginModel;
