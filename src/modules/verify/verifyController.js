const verifyModel = require('./verifyModel');

async function verifyAccount(req, res) {
    const { token } = req.params;

    try {
        // Kiểm tra token có hợp lệ không
        const user = await verifyModel.findUserByToken(token);

        if (!user) {
            return res.render('register', {
                message: 'Invalid or expired token.',
                layout: false,
                title: 'Verification Failed',
            });
        }

        // Chuyển người dùng vào bảng `users` 
        await verifyModel.moveUserToVerified(user);

        // Xóa người dùng khỏi bảng `pending_users`
        await verifyModel.deleteUserFromPending(token);

        res.render('login', {
            message: 'Account verified successfully, you can now login.',
            layout: false,
            title: 'Account Verified',
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error in verification', error: error.message });
    }
}

module.exports = {
    verifyAccount,
};
