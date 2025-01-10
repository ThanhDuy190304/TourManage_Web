const logoutModel = require('./logoutModel');

class logoutService {
    static async deleteRefreshToken(user_id, device_id) {
        try {
            await logoutModel.deleteRefreshToken(user_id, device_id);
        } catch (error) {
            console.error('Error while deleting refresh token:', error);
            throw new Error('There was an issue processing your logout request. Please try again later.');
        }
    }
}
module.exports = logoutService;
