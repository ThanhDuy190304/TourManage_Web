const RegisterService = require('../register/registerService');
const userModel = require('../user/userModel');
const userService = require('../user/userService');
const LoginService = require('../login/loginService');

class GoogleAuthService {
    static async handleGoogleAuth(email, deviceId) {
        try {
            let user = await userService.checkEmailExists(email);
            if (!user) {
                user = await RegisterService.registerWithGoogle(email);
            }
            user = await userModel.checkUserExistsInUsers(email, email);
            if (!user) {
                return {
                    success: false,
                    message: 'Account does not exist!',
                };
            }
            if (user.is_banned) {
                return {
                    success: false,
                    message: 'Account is banned!',
                };
            }
            const { accessToken, refreshToken } = await LoginService.authenticateUser(user.userId, user.userName, user.roleId, deviceId);
            return {
                success: true,
                accessToken,
                refreshToken,
            };

        } catch (error) {
            console.error('Error GoogleAuthService.handleGoogleAuth:', error);
            throw new Error('Error GoogleAuthService.handleGoogleAuth');
        }
    }
}
module.exports = GoogleAuthService;