const { deleteRefreshToken } = require('./logoutModel');

exports.logoutUser = async (req, res) => {
    const { user_id, device_id } = res.locals.user || {}; // Lấy thông tin user từ middleware

    // Nếu có thông tin người dùng, xóa refresh token khỏi database
    if (user_id && device_id) {
        console.log("1");
        try {
            await deleteRefreshToken(user_id, device_id);
        } catch (error) {
            return res.status(500).json({ message: 'Error during logout' });
        }
    }

    // Xóa cookie lưu token
    res.clearCookie(process.env.ACCESS_TOKEN_NAME, { httpOnly: true, path: '/' });
    res.clearCookie(process.env.REFRESH_TOKEN_NAME, { httpOnly: true, path: '/' });

    res.redirect('/'); // Đổi đường dẫn nếu cần
};
