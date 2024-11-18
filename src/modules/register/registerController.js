const registerModel = require('./registerModel');
const argon2 = require('argon2');

async function registerUser(req, res) {
    const { user_name, email, password, confirmPassword } = req.body;


    if (password !== confirmPassword) {
        return res.render('register', {
            message: 'Confirmation password does not match', layout: false,
            title: 'Register Page',
        });
    }

    try {
        // Tạo người dùng mới
        const encryptionPassword = await argon2.hash(password); // mã hóa mật khẩu

        await registerModel.registerUser(user_name, email, encryptionPassword); // thay đổi mật khẩu cũ thành mật khẩu đã mã hóa
        res.redirect('/login?message=Registered successfully, please login!');

    } catch (error) {
        // Xử lý lỗi khi trùng lặp tên người dùng hoặc email
        if (error.code === '23505') {
            if (error.detail.includes('Key (user_name)')) {
                return res.render('register', {
                    message: 'Username already exists, please choose another name.', layout: false,
                    title: 'Register Page',
                });
            } else if (error.detail.includes('Key (email)')) {
                return res.render('register', {
                    message: 'Email already exists, please choose another email.', layout: false,
                    title: 'Register Page',
                });
            }
        } else {
            console.error(error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng ký người dùng mới' });
        }
    }
}
module.exports = {
    registerUser,
};