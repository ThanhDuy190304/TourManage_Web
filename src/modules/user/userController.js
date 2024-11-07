const UserModel = require('./userModel');

async function register(req, res) {
    const { user_name, password } = req.body;

    // Kiểm tra giá trị đầu vào từ phía server
    if (!user_name || !password) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
    }

    try {
        // Tạo người dùng mới
        await UserModel.createUser(user_name, password);
        res.render('register', {
            message: 'Đăng ký thành công', layout: false,
            title: 'Register Page',
        });
    } catch (error) {
        if (error.message.includes('Account with the given username already exists')) {
            res.render('register', {
                message: 'Tên người dùng đã tồn tại, vui lòng chọn tên khác', layout: false,
                title: 'Register Page',
            });
        } else {
            console.error(error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng ký người dùng mới' });
        }
    }
}

module.exports = {
    register,
};
