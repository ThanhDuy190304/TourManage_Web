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
                roleId: user.role_id
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

    static async getTouristHistoryBooking(touristId) {

    }

    static async createFeedback(touristId,comment, rating, tourId) {
        try {
            const query = `INSERT INTO feedbacks (tourist_id, tour_id, star, rate, dateofreview)
                           VALUES ($1, $4, $3, $2, now())`;
            await db.query(query, [touristId,comment, rating, tourId]);
        } catch (error) {
            console.error("Error create feedback in userModel: ", error);
            throw new Error("Error create feedback in userModel: ");
        }
    }

    static async updateProfile(userId,fullname,birthdate,contact,address) {
        try {
            const query = `UPDATE profile_users
                            SET user_fullname = $2, user_birthdate = $3, user_contact=$4, user_address=$5
                           WHERE user_id = $1`;
            await db.query(query, [userId,fullname,birthdate,contact,address]);
        } catch (error) {
            console.error("Error create feedback in userModel: ", error);
            throw new Error("Error create feedback in userModel: ");
        }
    }
}

module.exports = UserModel;
