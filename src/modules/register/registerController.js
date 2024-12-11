const registerService = require('./registerService');

class RegisterController {
    static async registerUser(req, res) {
        const { user_name, email, password, confirmPassword } = req.body;

        // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp không
        if (password !== confirmPassword) {
            return res.render('register', {
                message: 'Confirmation password does not match!',
                layout: false,
                title: 'Register Page',
            });
        }

        try {
            // Gọi service đăng ký
            const result = await registerService.register(user_name, email, password);

            if (result.success) {
                return res.render('register', {
                    message: 'Registration successful, please check your email for verifying!',
                    layout: false,
                    title: 'Register Page',
                });
            }

            return res.render('register', {
                message: result.error,
                layout: false,
                title: 'Register Page',
            });
        } catch (error) {
            // Nếu có lỗi không lường trước được
            return res.render('register', {
                message: 'An unexpected error occurred. Please try again later!',
                layout: false,
                title: 'Register Page',
            });
        }
    }
}

module.exports = RegisterController;
