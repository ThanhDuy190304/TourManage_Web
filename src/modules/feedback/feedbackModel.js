const db = require('../../config/db');

class feedbackModel {
    static async countFeedbackByTourId(tour_id,page, pageSize,starFilter) {
        const query = `SELECT count(*) FROM feedbacks f
                        JOIN tourists t on f.tourist_id = t.tourist_id
                        JOIN users u on u.user_id = t.user_id
                        WHERE tour_id = $1 AND ($2 = '' OR f.star = CAST($2 AS INTEGER))
                        `;
        const result = await db.query(query, [tour_id, starFilter]);
        if (result.rows.length > 0) {
            return result.rows[0].count;
        }

        return null;
    }

    static async getFeedbackByTourId(tour_id,page, pageSize,starFilter) {
        const query = `SELECT * FROM feedbacks f
                        JOIN tourists t on f.tourist_id = t.tourist_id
                        JOIN users u on u.user_id = t.user_id
                        WHERE tour_id = $1 AND ($3 = '' OR f.star = CAST($3 AS INTEGER))
                        LIMIT $2 OFFSET ${(page - 1) * pageSize}
                        `;
        const result = await db.query(query, [tour_id, pageSize,starFilter]);
        if (result.rows.length > 0) {
            return result.rows;
        }

        return null;
    }
}

module.exports = feedbackModel;
