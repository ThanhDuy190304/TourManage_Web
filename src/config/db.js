const { Pool } = require('pg');
require('dotenv').config();  // Đảm bảo dotenv được sử dụng nếu bạn cần nạp từ .env trên local

// Tạo pool kết nối tới cơ sở dữ liệu
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
