const db = require('../../config/db');

class logoutModel {
    static async deleteRefreshToken(userId, deviceId) {
        const query = `DELETE FROM refresh_tokens WHERE user_id = $1 AND device_id = $2`;
        return await db.query(query, [userId, deviceId]);
    }
}

module.exports = logoutModel;
