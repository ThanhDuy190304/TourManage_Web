const { generateAccessToken, generateRefreshToken } = require("../../utils/generateTokensUtils");
const loginModel = require("./loginModel");

class LoginService {
    static async authenticateUser(userId, userName, roleId, deviceId) {
        try {
            const accessToken = generateAccessToken(userId, userName, roleId, deviceId);
            const refreshToken = generateRefreshToken(userId, userName, roleId, deviceId);
            await loginModel.saveRefreshToken(userId, refreshToken, deviceId);
            return { accessToken, refreshToken };
        } catch (error) {
            console.error("Error in authenticateUser:", error);
            throw new Error("Failed to authenticate user");
        }
    }
}
module.exports = LoginService;
