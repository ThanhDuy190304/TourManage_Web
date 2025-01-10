const registerService = require('./registerService');
const validatePassword = require('../../utils/passwordUtils').validatePassword;
class RegisterController {
    static async registerUser(req, res) {
        let { userName, email, password, confirmPassword } = req.body;
        if (!userName || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'Please fill in all fields!' });
        }
        userName = userName.trim();
        email = email.trim();
        password = password.trim();
        confirmPassword = confirmPassword.trim();
        if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
            return res.status(400).json({ message: 'Email is invalid!' });
        }
        // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp không
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Confirmation password does not match.' });
        }
        const checkValidPassword = validatePassword(password);
        if (!checkValidPassword.valid) {
            return res.status(400).json({ message: checkValidPassword.message });
        }

        try {
            const result = await registerService.register(userName, email, password);

            if (result.success) {
                return res.status(200).json({ message: 'Registration successful, please check your email for verifying!' });
            }

            return res.status(400).json({ message: result.message });
        } catch (error) {
            // Nếu có lỗi không lường trước được
            return res.status(500).json({ message: 'An error occurred, please try again later.' });
        }
    }
}

module.exports = RegisterController;
