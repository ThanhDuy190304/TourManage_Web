const feedbackService = require("./feedbackService");

class feedbackController {

    static async getFeedbackByTourId(req, res) {
        try {
            const { tour_id } = req.params;
            const { page, pageSize,starFilter} = req.query;
            let feedbackList = await feedbackService.getFeedbackByTourId(tour_id,page, pageSize,starFilter);
            res.status(200).json({
                success: true,
                feedbackList: feedbackList,
            });
        } catch (error) {
            console.error("Error in getUserProfile:", error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }
}

module.exports = feedbackController;
