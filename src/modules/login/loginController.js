const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
require('dotenv').config();

const loginModel = require('./loginModel');
const userModel = require('../shared/userModel');
const { hashPassword } = require('../../utils/passwordUtils');

passport.use(
    new LocalStrategy(
        {
            usernameField: 'Username_Email', // Tên trường gửi từ client
            passwordField: 'password',      // Trường mật khẩu gửi từ client
        },
        async (username_email, password, done) => {
            try {
                const pendingUsers = await userModel.checkUserExistsInPendingUsers(username_email, username_email);
                if (pendingUsers.length > 0) {
                    return done(null, false, {
                        message: 'This username or email is already registered and awaiting email verification.\
                                Please check your email to verify your account.' });
                }
                const user = await userModel.checkUserExistsInUsers(username_email, username_email);
                if (user.length == 0) {
                    return done(null, false, { message: 'Invalid username/email or password.' });
                }

                const hashedPassword = hashPassword(password, user.salt);
                if (hashedPassword !== user.user_password) {
                    return done(null, false, { message: 'Invalid username/email or password.' });
                }

                return done(null, user); // Xác thực thành công
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Hàm xử lý đăng nhập và tạo token
function loginUser(req, res) {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            console.error("Passport Authentication Error:", err); // Log chi tiết lỗi

            return res.status(500).json({ message: 'Authentication failed.', error: err.message });
        }
        if (!user) {
            return res.render('login',
                {
                    message: info.message,
                    layout: false,
                    title: 'Login Page'
                });
        }

        // Tạo JWT khi xác thực thành công
        const token = jwt.sign(
            {
                user_id: user.user_id,
                user_name: user.user_name,
            },
            process.env.JWT_SECRET, // Khóa bí mật cho JWT
            { expiresIn: '1h' } // Token hết hạn sau 1 giờ
        );

        res.cookie('auth_token', token, { httpOnly: true });
        res.redirect('/');
    })(req, res);
}

module.exports = {
    loginUser
};
