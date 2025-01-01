const userService = require("./userService");

class userController {

    static async getUserProfile(req, res) {
        try {
            const user = res.locals.user;
            if (!user) {
                return res.status(401);
            }

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
        if (!user) {
            return res.status(401);
        }

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

    static async createFeedback(req, res) {
        const user = res.locals.user;
        if (!user) {
            return res.status(401);
        }
        const { comment, rating,tourId } = req.body;
        try {
            let touristId = await userService.getTouristId(user.userId);
            await userService.createFeedback(touristId,comment, rating,tourId);
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error("Error in createFeedback:", error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }

    static async updateProfile(req, res) {
        const user = res.locals.user;
        if (!user) {
            return res.status(401);
        }
        const { fullname,birthdate,contact,address} = req.body;
        try {
            await userService.updateProfile(user.userId,fullname,birthdate,contact,address);
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error("Error in updateProfile:", error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }
}

module.exports = userController;
