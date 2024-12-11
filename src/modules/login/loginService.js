const { generateAccessToken, generateRefreshToken } = require("../../utils/generateTokensUtils");
const loginModel = require("./loginModel");

const loginService = {
    async authenticateUser(userId, userName, roleID, deviceId) {
        try {
            const accessToken = generateAccessToken(userId, userName, roleID, deviceId);
            const refreshToken = generateRefreshToken(userId, userName, roleID, deviceId);

            // Lưu refresh token vào cơ sở dữ liệu
            await loginModel.saveRefreshToken(userId, refreshToken, deviceId);

            return { accessToken, refreshToken };
        } catch (error) {
            console.error("Error in authenticateUser:", error); // In lỗi chi tiết
            // Ném lỗi có thông điệp rõ ràng
            throw new Error(`Failed to authenticate user`);
        }
    }
};

module.exports = loginService;
