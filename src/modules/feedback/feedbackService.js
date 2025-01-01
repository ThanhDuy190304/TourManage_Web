const feedbackModel = require("./feedbackModel");
const { format } = require('date-fns');

class feedbackService {
    static async getFeedbackByTourId(tour_id,page, pageSize,starFilter) {
        try {
            let numberofFeedback = await feedbackModel.countFeedbackByTourId(tour_id,page, pageSize,starFilter);
            let feedbackList = await feedbackModel.getFeedbackByTourId(tour_id,page, pageSize,starFilter);
            if (!feedbackList || feedbackList.length === 0) {
                return {
                    feedbacks: [],
                    total: 0,
                };
            }
            const feedbacks = feedbackList.map((feedback) => ({
                ...feedback,
                dateofreview: format(new Date(feedback.dateofreview), 'dd-MM-yyyy'),
            }));
            
            return {
                feedbacks,
                total: numberofFeedback,
            };
        } catch (error) {
            console.log("Error getFeedbackByTourId in feedbackService: ", error.message);
            throw new Error("Error getFeedbackByTourId in feedbackService");
        }

    }
}

module.exports = feedbackService