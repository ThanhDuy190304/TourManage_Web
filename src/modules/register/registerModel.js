const db = require('../../config/db'); // Giả sử bạn có một tệp db.js để kết nối với cơ sở dữ liệu

async function registerUser(userName, email, encryptionPassword) {

    try{
        // Kiểm tra tài khoản đã tồn tại chưa
        const checkUser = 'SELECT * FROM users WHERE user_name = $1 OR email = $2';
        const result = await db.query(checkUser, [userName, email]);

        if(result.rowCount > 0){
            throw new Error('Username or email already exists.');
        }

        // Nếu tên người dùng chưa tồn tại, thực hiện chèn người dùng mới
        const query = 'INSERT INTO users (user_name, email, user_password) VALUES ($1, $2, $3)';
        await db.query(query, [userName, email, encryptionPassword]);
    }
    catch(error){
        console.error('Can not insert: ', error);
        throw error;
    }

}

module.exports = {
    registerUser,
};