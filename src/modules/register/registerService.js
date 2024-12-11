const registerModel = require('./registerModel');
const userModel = require('../user/userModel');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../../utils/emailUtils');
const { generateSalt, hashPassword } = require('../../utils/passwordUtils');

const registerService = {
    async register(user_name, email, password) {
        try {
            // Kiểm tra xem tài khoản đã tồn tại trong users hoặc pending_users chưa
            const [existingUsers, pendingUsers] = await Promise.all([
                userModel.checkUserExistsInUsers(user_name, email),
                userModel.checkUserExistsInPendingUsers(user_name, email)
            ]);

            // Nếu đã tồn tại thì trả về lỗi cụ thể
            if (existingUsers) {
                return { error: 'Username or Email already exists.' };
            }
            if (pendingUsers) {
                return { error: 'This username or email is already registered and awaiting email verification. Please check your email to verify your account.' };
            }

            // Tạo salt và mã hóa mật khẩu
            const salt = generateSalt();
            const encryptedPassword = hashPassword(password, salt);

            // Tạo mã xác thực và lưu người dùng vào bảng pending_users
            const verificationToken = crypto.randomBytes(20).toString('hex');
            await registerModel.createPendingUser(user_name, email, encryptedPassword, salt, verificationToken);

            // Gửi email xác thực
            await sendVerificationEmail(email, verificationToken);

            // Trả về kết quả thành công
            return { success: true };
        } catch (error) {
            console.error('Error during registration:', error); // Ghi lại lỗi cho mục đích debug
            return { error: 'There was an issue processing your registration. Please try again later.' };
        }
    }
};

module.exports = registerService;
