const db = require('../../config/db');


// Kiểm tra tài khoản tồn tại trong bảng users
async function checkUserExistsInUsers(userName, email) {
    const query = 'SELECT * FROM users WHERE user_name = $1 OR email = $2';
    const result = await db.query(query, [userName, email]);
    return result.rows[0] || []; // Trả về danh sách người dùng tìm thấy
}

// Kiểm tra tài khoản tồn tại trong bảng pending_users
async function checkUserExistsInPendingUsers(userName, email) {
    const query = 'SELECT * FROM pending_users WHERE user_name = $1 OR email = $2';
    const result = await db.query(query, [userName, email]);
    return result.rows[0] || []; // Trả về danh sách người dùng tìm thấy
}

// Tìm người dùng theo ID
async function findUserById(userId) {
    try {
        const query = 'SELECT * FROM users WHERE user_id = $1';
        const result = await db.query(query, [userId]);
        return result.rows[0] || null; // Trả về người dùng nếu có, ngược lại là null
    } catch (error) {
        console.error('Database error:', error.message);
        throw new Error('Error querying user information by ID');
    }
}

module.exports = {
    checkUserExistsInUsers,
    checkUserExistsInPendingUsers,
};