const { hashPassword, generateSalt, generateRandomPassword } = require('../../utils/passwordUtils');
const userService = require('../user/userService');
const { sendNewPassword } = require('../../utils/emailUtils');
class ForgetPasswordService {
    static async requireNewPassword(email) {
        try {
            let user = await userService.checkEmailExists(email);
            if (!user) {
                return {
                    success: false,
                    message: 'Email haven\'t been registered'
                }
            }
            let newPassword = generateRandomPassword();
            let salt = generateSalt();
            let hashedPassword = hashPassword(newPassword, salt);
            await sendNewPassword(email, newPassword);
            await userService.updatePassword(user.user_id, hashedPassword, salt);
            return {
                success: true,
                message: 'New password has been sent to your email'
            }
        } catch (err) {
            console.log("Error requireNewPassword in forgetPasswordService: ", err.message);
            throw new Error("Error requireNewPassword in forgetPasswordService");
        }
    }
}

module.exports = ForgetPasswordService;