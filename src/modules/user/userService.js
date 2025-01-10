const userModel = require("./userModel");
const reservationService = require("../reservation/reservationService")
const { hashPassword, generateSalt } = require('../../utils/passwordUtils');
const { format } = require('date-fns');

class userService {
    static async getPublicProfile(userId) {
        try {
            let userProfile = await userModel.getProfileUser(userId);
            userProfile.birthdate = format(new Date(userProfile.birthdate), 'dd-MM-yyyy');
            return userProfile;
        } catch (error) {
            console.error("Error getPublicProfile in userService: ", error.message);
            throw new Error("Error getPublicProfile in userService");
        }

    }

    static async getTouristId(userId) {
        try {
            let touristId = await userModel.getTouristId(userId);
            return touristId;
        } catch (error) {
            console.error("Error getTouristId in userService: ", error.message);
            throw new Error("Error getTouristId in userService");
        }
    }

    static async getUserBookingHistory(touristId) {
        try {
            let bookingHistory = await reservationService.getReservationByUserId(touristId);
            return bookingHistory;
        } catch (error) {
            console.error("Error getUserHistoryBooking in userService: ", error.message);
            throw new Error("Error getUserHistoryBooking in userService");
        }
    }

    static async checkEmailExists(email) {
        try {
            let user = await userModel.checkEmailExists(email);
            return user;
        } catch (error) {
            console.error("Error checkEmailExists in userService: ", error.message);
            throw new Error("Error checkEmailExists in userService");
        }
    }

    static async updatePassword(userId, hashedPassword, salt) {
        try {
            await userModel.updatePassword(userId, hashedPassword, salt);
        } catch (error) {
            console.error("Error updatePassword in userService: ", error.message);
            throw new Error("Error updatePassword in userService");
        }
    }

    static async getAccount(userId) {
        try {
            let userAccount = await userModel.getAccount(userId);
            userAccount = {
                email: userAccount.email,
                userName: userAccount.userName,
            }
            return userAccount;
        } catch (error) {
            console.error("Error getAccount in userService: ", error.message);
            throw new Error("Error getAccount in userService");
        }
    }

    static async changePassword(userId, oldPassword, newPassword) {
        try {
            const userAccount = await userModel.getAccount(userId);
            if (!userAccount) {
                return { success: false, message: 'User not found.' };
            }
            const { userPassword, salt } = userAccount;
            const isMatch = hashPassword(oldPassword, salt) === userPassword;
            if (!isMatch) {
                return { success: false, message: 'Current password is incorrect.' };
            }
            const newSalt = generateSalt();
            const hashedPassword = hashPassword(newPassword, newSalt);
            await userModel.updatePassword(userId, hashedPassword, newSalt);
            return { success: true, message: 'Change password successfully.' };
        } catch (error) {
            console.error("Error userService.changePassword: ", error.message);
            throw new Error("Error userService.changePassword");
        }
    }
    static async createFeedback(touristId, comment, rating, tourId) {
        try {

            await userModel.createFeedback(touristId, comment, rating, tourId);

        } catch (error) {
            console.log("Error createFeedback in userService: ", error.message);
            throw new Error("Error createFeedback in userService");
        }
    }

    static async updateProfile(userId, fullname, birthdate, contact, address) {
        try {

            await userModel.updateProfile(userId, fullname, birthdate, contact, address);

        } catch (error) {
            console.log("Error createFeedback in userService: ", error.message);
            throw new Error("Error createFeedback in userService");
        }
    }
}

module.exports = userService