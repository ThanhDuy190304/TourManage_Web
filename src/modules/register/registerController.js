const registerModel = require('./registerModel');
const { generateSalt, hashPassword } = require('../../utils/passwordUtils');

class RegisterController {
    static async registerUser(req, res) {
        const { user_name, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.render('register', {
                message: 'Confirmation password does not match', layout: false,
                title: 'Register Page',
            });
        }

        try {
            const salt = generateSalt();
            const encryptedPassword = hashPassword(password, salt);

            await registerModel.registerUser(user_name, email, encryptedPassword, salt);

            res.render('register', {
                message: 'Registration successful, please check your email for verifying',
                layout: false,
                title: 'Register Page',
            });
        } catch (error) {
            return res.render('register', {
                message: error.message || 'An unexpected error occurred. Please try again later.',
                layout: false,
                title: 'Register Page',
            });
        }
    }
}

module.exports = RegisterController;
