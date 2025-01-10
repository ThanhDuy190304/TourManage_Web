const userService = require("./userService");
const { validatePassword } = require("../../utils/passwordUtils");
class userController {

    static async getUserProfile(req, res) {
        try {
            const user = res.locals.user;
            let userProfile = await userService.getPublicProfile(user.userId);
            res.status(200).json({
                success: true,
                userProfile: userProfile,
            });
        } catch (error) {
            console.error("Error in getUserProfile:", error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }

    static async getUserBookingHistory(req, res) {
        const user = res.locals.user;
        try {
            let touristId = await userService.getTouristId(user.userId);
            let bookingHistory = await userService.getUserBookingHistory(touristId);
            res.status(200).json({
                success: true,
                bookingHistory: bookingHistory,
            });
        } catch (error) {
            console.error("Error in getUserHistoryBooking:", error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }

    static async getAccount(req, res) {
        const user = res.locals.user;
        try {
            const userAccount = await userService.getAccount(user.userId);
            if (!userAccount) {
                return res.status(404).json({
                    message: 'User not found.'
                });
            }
            res.status(200).json({
                userAccount: userAccount,
            });
        } catch (error) {
            console.error("Error in user.getAccount:", error);
            res.status(500).json({
                message: 'Have an error. Please try again later.'
            });
        }
    }

    static async changePassword(req, res) {
        try {
            const user = res.locals.user;
            let { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                return res.status(400).json({ message: 'Please provide both current and new password.' });
            }
            currentPassword = currentPassword.trim();
            newPassword = newPassword.trim();
            if (currentPassword === newPassword) {
                return res.status(400).json({
                    message: 'New password must be different from the current password.'
                });
            }
            const checkValidPassword = validatePassword(newPassword);
            if (!checkValidPassword.valid) {
                return res.status(400).json({
                    message: checkValidPassword.message
                });
            }
            const { success, message } = await userService.changePassword(user.userId, currentPassword, newPassword);
            if (!success) {
                return res.status(400).json({
                    message: message
                });
            }
            return res.status(204).send();
        } catch (error) {
            console.error("Error in changePassword:", error);
            res.status(500).json({
                message: 'Have an error. Please try again later.'
            });
        }
    }
}

module.exports = userController;
