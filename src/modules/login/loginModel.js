const db = require('../../config/db');

class LoginModel {
    static async saveRefreshToken(userId, refreshToken, deviceID) {
        const query = 'INSERT INTO refresh_tokens (user_id, token, device_ID) VALUES ($1, $2, $3) ON CONFLICT (user_id, device_ID) DO UPDATE SET token = $2';
        await db.query(query, [userId, refreshToken, deviceID]);
    }
}
module.exports = LoginModel;
