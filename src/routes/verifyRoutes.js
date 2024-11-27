const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.get('/:token', async (req, res) => {
    const { token } = req.params;

    try {
        // Kiểm tra token có hợp lệ không
        const result = await db.query('SELECT * FROM pending_users WHERE verfication_token = $1', [token]);

        if (result.rowCount === 0) {
            return res.render('register', {
                message: 'Invalid or expired token.',
                layout: false,
                title: 'Verification Failed',
            });
        }

        const user = result.rows[0];

        // Chuyển người dùng vào bảng `users` và cập nhật cột `is_verified`
        const query = 'INSERT INTO users (user_name, email, user_password) VALUES ($1, $2, $3)';
        await db.query(query, [user.user_name, user.email, user.user_password]);

        // Xóa người dùng khỏi bảng `pending_users`
        await db.query('DELETE FROM pending_users WHERE verfication_token = $1', [token]);

        res.render('login', {
            message: 'Account verified successfully, you can now login.',
            layout: false,
            title: 'Account Verified',
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error in verification', error: error.message });
    }
});

module.exports = router;
