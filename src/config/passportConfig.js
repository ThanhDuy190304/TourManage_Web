const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../modules/user/userModel');
require('dotenv').config();
const { hashPassword } = require('../utils/passwordUtils');
passport.use(
    new LocalStrategy(
        {
            usernameField: 'Username_Email',
            passwordField: 'password',
        },
        async (username_email, password, done) => {
            try {
                username_email = username_email.trim();
                password = password.trim();
                const pendingUser = await userModel.checkUserExistsInPendingUsers(username_email, username_email);

                if (pendingUser) {
                    return done(null, false, {
                        message: 'This username or email is already registered and awaiting email verification. Please check your email to verify your account.'
                    });
                }
                const user = await userModel.checkUserExistsInUsers(username_email, username_email);
                if (!user) {
                    return done(null, false, { message: 'Invalid username/email or password.' });
                }
                // Kiểm tra mật khẩu
                const hashedPassword = hashPassword(password, user.salt);
                if (hashedPassword !== user.userPassword) {
                    return done(null, false, { message: 'Invalid username/email or password.' });
                }
                if (user.is_banned) {
                    return done(null, false, { message: 'This account has been banned.' });
                }
                // Nếu xác thực thành công
                return done(null, user);
            } catch (error) {
                console.error('Error during authentication:', error);
                return done(error);
            }
        }
    ),
);
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.NODE_ENV === 'development'
                ? process.env.GOOGLE_CALLBACK_URL_DEVELOPMENT // Môi trường phát triển
                : process.env.GOOGLE_CALLBACK_URL_PRODUCTION, // Môi trường sản xuất
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                done(null, profile);
            } catch (error) {
                console.error('Error during authentication:', error);
                return done(error);
            }
        }
    )
);

module.exports = passport;
