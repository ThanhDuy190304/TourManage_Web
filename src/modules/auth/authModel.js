const db = require('../../config/db');

// Kiểm tra xem refreshToken có hợp lệ không
async function getRefreshTokenFromDb(token) {
    const query = 'SELECT * FROM refresh_tokens WHERE token = $1';
    const result = await db.query(query, [token]);
    return result.rows[0];
}

module.exports = { getRefreshTokenFromDb };
