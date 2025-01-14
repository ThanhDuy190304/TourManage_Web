const passport = require('../../config/passportConfig');
const GoogleAuthService = require('./googleAuthService');
const { getDeviceId } = require("../../utils/deviceID");
require('dotenv').config();

class GoogleAuthController {
    static googleAuth(req, res, next) {
        passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
    }
    static async googleAuthCallback(req, res, next) {
        passport.authenticate('google', { session: false }, async (err, profile, info) => {
            if (err) {
                console.error('Error GoogleAuthController.googleRegisterCallBack:', err.message);
                return res.status(500).json({ message: 'An error occurred, please try again later.' });
            }
            if (!profile) {
                return res.status(401).json({ message: info.message });
            }

            try {
                const userAgent = req.headers['user-agent'];
                const deviceId = getDeviceId(userAgent);
                const result = await GoogleAuthService.handleGoogleAuth(profile.emails[0].value, deviceId);

                if (!result.success) {
                    return res.status(401).json({ message: result.message });
                }

                // Set cookies only if the login is successful
                res.cookie(process.env.ACCESS_TOKEN_NAME, result.accessToken, {
                    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict',
                    path: '/',
                });

                res.cookie(process.env.REFRESH_TOKEN_NAME, result.refreshToken, {
                    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict',
                    path: '/',
                });
                // Redirect after setting cookies
                return res.redirect('/'); // Ensure response is only sent once
            } catch (error) {
                console.error('Error GoogleAuthController.googleAuthCallback:', error);
                return res.status(500).json({ message: 'An error occurred, please try again later.' });
            }
        })(req, res, next);  // Ensure this is the last place where passport.authenticate is called
    }
}

module.exports = GoogleAuthController;