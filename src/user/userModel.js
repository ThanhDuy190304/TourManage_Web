const pool = require('../config/db');  // Kết nối đến cơ sở dữ liệu

async function createUser(userName, password) {
    // Kiểm tra xem tên người dùng có tồn tại trong cơ sở dữ liệu không
    const checkQuery = 'SELECT * FROM users WHERE user_name = $1';
    const result = await pool.query(checkQuery, [userName]);

    if (result.rows.length > 0) {
        // Nếu tên người dùng đã tồn tại, ném ra lỗi
        throw new Error('Account with the given username already exists');
    }

    // Nếu tên người dùng chưa tồn tại, thực hiện chèn người dùng mới
    const query = 'INSERT INTO users (user_name, user_pass) VALUES ($1, $2)';
    await pool.query(query, [userName, password]);
}

module.exports = {
    createUser,
};
