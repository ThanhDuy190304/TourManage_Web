const db = require('../../config/db'); // Giả sử bạn có một tệp db.js để kết nối với cơ sở dữ liệu

async function registerUser(userName, email, password) {

    // Nếu tên người dùng chưa tồn tại, thực hiện chèn người dùng mới
    const query = 'INSERT INTO users (user_name, email, user_password) VALUES ($1, $2, $3)';
    await db.query(query, [userName, email, password]);
}

module.exports = {
    registerUser,
};
