const db = require('../../config/db');

exports.deleteRefreshToken = async (userId, deviceId) => {
    const query = `DELETE FROM refresh_tokens WHERE user_id = $1 AND device_id = $2`;
    await db.query(query, [userId, deviceId]);
};
