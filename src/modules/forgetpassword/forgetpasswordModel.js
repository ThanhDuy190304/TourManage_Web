const db = require('../../config/db');
const argon2 = require('argon2');

async function getUserByEmail(email) {
    try {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await db.query(query, [email]);

        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0];
    } catch (error) {
        console.error(error);
        throw new Error('Database error');
    }
}

async function storeResetToken(userId, token, expiresIn) {
    try {
        const query = `
          INSERT INTO reset_tokens (user_id, token, expires_at)
          VALUES ($1, $2, $3)
          ON CONFLICT (token) DO UPDATE SET expires_at = EXCLUDED.expires_at;
        `;
        await db.query(query, [userId, token, new Date(expiresIn)]);
    } catch (error) {
        console.error(error);
        throw new Error('Error storing reset token');
    }
}

async function verifyResetToken(token) {
    try {
        const query = 'SELECT * FROM reset_tokens WHERE token = $1 AND expires_at > NOW()';
        const result = await db.query(query, [token]);

        if (result.rowCount === 0) {
            return null;
        }

        const userId = result.rows[0].user_id;
        const userQuery = 'SELECT * FROM users WHERE user_id = $1';
        const userResult = await db.query(userQuery, [userId]);

        return userResult.rows[0];
    } catch (error) {
        console.error(error);
        throw new Error('Error verifying reset token');
    }
}

async function updatePassword(userId, newPassword) {
    try {
        const hashedPassword = await argon2.hash(newPassword);
        const query = 'UPDATE users SET user_password = $1 WHERE user_id = $2';
        await db.query(query, [hashedPassword, userId]);
    } catch (error) {
        console.error(error);
        throw new Error('Error updating password');
    }
}

module.exports = {
    getUserByEmail,
    storeResetToken,
    verifyResetToken,
    updatePassword,
};
