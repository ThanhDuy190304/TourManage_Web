const userModel = require("./userModel");
const reservationService = require("../reservation/reservationService")
const { format } = require('date-fns');

class userService {
    static async getPublicProfile(userId) {
        try {
            let userProfile = await userModel.getProfileUser(userId);
            userProfile.birthdate = format(new Date(userProfile.birthdate), 'dd-MM-yyyy');
            return userProfile;
        } catch (error) {
            console.log("Error getPublicProfile in userService: ", error.message);
            throw new Error("Error getPublicProfile in userService");
        }

    }

    static async getTouristId(userId) {
        try {
            let touristId = await userModel.getTouristId(userId);
            return touristId;
        } catch (error) {
            console.log("Error getTouristId in userService: ", error.message);
            throw new Error("Error getTouristId in userService");
        }
    }

    static async getUserBookingHistory(touristId) {
        try {
            let bookingHistory = await reservationService.getReservationByUserId(touristId);
            return bookingHistory;
        } catch (error) {
            console.log("Error getUserHistoryBooking in userService: ", error.message);
            throw new Error("Error getUserHistoryBooking in userService");
        }
    }

    static async createFeedback(touristId,comment, rating, tourId) {
        try {

            await userModel.createFeedback(touristId,comment, rating, tourId);

        } catch (error) {
            console.log("Error createFeedback in userService: ", error.message);
            throw new Error("Error createFeedback in userService");
        }
    }

    static async updateProfile(userId,fullname,birthdate,contact,address) {
        try {

            await userModel.updateProfile(userId,fullname,birthdate,contact,address);

        } catch (error) {
            console.log("Error createFeedback in userService: ", error.message);
            throw new Error("Error createFeedback in userService");
        }
    }
}

module.exports = userService