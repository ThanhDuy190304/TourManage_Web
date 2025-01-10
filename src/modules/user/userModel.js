const db = require('../../config/db');

class UserModel {

    static async checkUserExistsInUsers(userName, email) {
        const query = 'SELECT * FROM users WHERE user_name = $1 OR email = $2';
        const result = await db.query(query, [userName, email]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const userData = {
                userId: user.user_id,
                userName: user.user_name,
                userPassword: user.user_password,
                email: user.email,
                salt: user.salt,
                roleId: user.role_id,
                is_banned: user.is_banned,
            };
            return userData;
        }

        return null;
    }

    static async checkUserExistsInPendingUsers(userName, email) {
        const query = 'SELECT * FROM pending_users WHERE user_name = $1 OR email = $2';
        const result = await db.query(query, [userName, email]);
        return result.rows[0] || null;
    }

    /**
     * Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu hay chưa.
     * 
     * @param {string} email - Email cần kiểm tra.
     * @returns {Promise<object|null>} - Trả về đối tượng chứa user_id, is_banned nếu email tồn tại, ngược lại trả về null.
     * @throws {Error} - Nếu xảy ra lỗi trong quá trình truy vấn cơ sở dữ liệu.
    */
    static async checkEmailExists(email) {
        try {
            const query = 'SELECT * FROM users WHERE email = $1';
            const result = await db.query(query, [email]);
            return result.rows[0] || null;
        } catch (error) {
            console.log("Error checkEmailExists in userModel: ", error.message);
            throw new Error("Error checkEmailExists in userModel");
        }
    }

    static async getProfileUser(userId) {
        const query = `SELECT u.email, p_u.user_fullname, p_u.user_birthdate, p_u.user_contact, p_u.user_address
                   FROM users u 
                   JOIN profile_users p_u ON u.user_id = p_u.user_id 
                   WHERE u.user_id = $1`; // Thêm điều kiện lọc theo userId

        try {
            const result = await db.query(query, [userId]);

            if (result.rows[0]) {
                const userProfile = result.rows[0];  // Lấy dữ liệu từ kết quả query
                const profileUser = {
                    fullname: userProfile.user_fullname,
                    email: userProfile.email,
                    birthdate: userProfile.user_birthdate,
                    contact: userProfile.user_contact,
                    address: userProfile.user_address
                };
                return profileUser;
            }
        } catch (err) {
            console.log("Error in userModel", err);
        }
        return null;
    }

    static async getTouristId(userId) {
        try {
            const query = `select t.tourist_id from tourists t join users u on t.user_id = u.user_id where t.user_id = $1`;
            const result = await db.query(query, [userId]);
            if (result.rows.length > 0) {
                return result.rows[0].tourist_id;
            }
            return null;
        } catch (error) {
            throw new Error("Error getTouristId in userModel: " + error.message);
        }
    }

    static async updatePassword(userId, hashedPassword, salt) {
        try {
            const query = 'UPDATE users SET user_password = $1, salt = $2 WHERE user_id = $3';
            await db.query(query, [hashedPassword, salt, userId]);
        } catch (error) {
            console.log("Error updatePassword in userModel: ", error.message);
            throw new Error("Error updatePassword in userModel");
        }
    }

    static async getAccount(userId) {
        try {
            const query = `SELECT u.email, u.user_name, u.user_password, u.salt from users u where u.user_id = $1`;
            const result = await db.query(query, [userId]);
            if (result.rows[0]) {
                return {
                    email: result.rows[0].email,
                    userName: result.rows[0].user_name,
                    userPassword: result.rows[0].user_password,
                    salt: result.rows[0].salt
                }
            }
            return null;
        } catch (error) {
            console.log("Error userModel.getAccount: ", error.message);
            throw new Error("Error userModel.getAccount");
        }
    }
}

module.exports = UserModel;
