const db = require('../../config/db');

// Kiểm tra xem token có hợp lệ không
async function findUserByToken(token) {
    const query = 'SELECT * FROM pending_users WHERE verification_token = $1';
    const result = await db.query(query, [token]);
    return result.rows[0] || null; // Trả về người dùng nếu có, ngược lại là null
}

// Chuyển người dùng từ bảng `pending_users` sang `users`
async function moveUserToVerified(user) {
    const query = 'INSERT INTO users (user_name, email, user_password, salt) VALUES ($1, $2, $3, $4)';
    await db.query(query, [user.user_name, user.email, user.user_password, user.salt]);
}

// Xóa người dùng khỏi bảng `pending_users`
async function deleteUserFromPending(token) {
    const query = 'DELETE FROM pending_users WHERE verification_token = $1';
    await db.query(query, [token]);
}

module.exports = {
    findUserByToken,
    moveUserToVerified,
    deleteUserFromPending,
};
