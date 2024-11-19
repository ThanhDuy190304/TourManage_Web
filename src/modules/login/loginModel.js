const db = require('../../config/db');

async function loginUser(userName_email) {

    try {
        // const query = userName_email.include('@')
        // ?'SELECT * FROM users WHERE email = $1'
        // :'SELECT * FROM users WHERE user_name = $1';

        const query = 'SELECT * FROM users WHERE user_name = $1 OR email = $1';

        const result = await db.query(query, [userName_email]);
        if (result.rowCount === 0) {
            return null;
        }

        const user = result.rows[0];

        // // So sánh mật khẩu
        // const isPasswordValid = await argon2.verify(user.user_password, password);
        // if (!isPasswordValid) {
        //     throw new Error('Username/email or password is incorrect');
        // }

        // return user; // Trả về thông tin người dùng nếu đăng nhập thành công

        return user;

    }
    catch (error) {
        console.error(error);
        throw new Error(error.message);
    }

}

module.exports = {
    loginUser,
}