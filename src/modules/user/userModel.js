// models/UserModel.js

const db = require('../../config/db');
const User = require('./user');

class UserModel {
    static async checkUserExistsInUsers(userName, email) {
        const query = 'SELECT * FROM users WHERE user_name = $1 OR email = $2';
        const result = await db.query(query, [userName, email]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const userObj = new User(
                user.user_id,
                user.user_name,
                user.user_password,
                user.email,
                user.salt,
                user.role_id,
            );
            return userObj;
        }

        return null;
    }

    static async checkUserExistsInPendingUsers(userName, email) {
        const query = 'SELECT * FROM pending_users WHERE user_name = $1 OR email = $2';
        const result = await db.query(query, [userName, email]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            return new User(user.user_id, user.user_name, user.hash_password, user.email, user.salt, user.role_id);
        }

        return null;
    }
}

module.exports = UserModel;
