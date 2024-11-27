const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // Xóa cookie lưu token
    res.clearCookie('auth_token', {
        httpOnly: true, // Khớp với lúc tạo cookie
        path: '/',      // Mặc định nếu không đặt cụ thể
    });

    res.redirect('/'); // Đổi đường dẫn nếu bạn muốn về trang khác
});

module.exports = router;
