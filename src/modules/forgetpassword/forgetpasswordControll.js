const forgetPasswordModel = require('./forgetPasswordModel');
const nodemailer = require('nodemailer'); // Để gửi email

// Gửi email với token reset mật khẩu
async function sendResetLink(req, res) {
    const { email } = req.body;

    try {
        // Tìm người dùng theo email
        const user = await forgetPasswordModel.getUserByEmail(email);
        if (!user) {
            return res.render('forget-password', {
                message: 'No user found with this email address.',
                layout: false,
                title: 'Forget Password',
            });
        }

        // Tạo token reset mật khẩu
        const resetToken = forgetPasswordModel.generateResetToken();
        const expiresIn = Date.now() + 60000; // Token hết hạn sau 1 phút (60000ms)

        // Lưu token vào cơ sở dữ liệu
        await forgetPasswordModel.storeResetToken(user.user_id, resetToken, expiresIn);

        // Gửi email chứa link reset mật khẩu
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com', // Sử dụng email của bạn
                pass: 'your-email-password',   // Mật khẩu email của bạn
            },
        });

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Password Reset Link',
            text: `Click the following link to reset your password: http://yourdomain.com/reset-password?token=${resetToken}`, // coi lại
        };

        // Gửi email
        await transporter.sendMail(mailOptions);

        // Thông báo người dùng đã nhận email
        res.render('forget-password', {
            message: 'Password reset link has been sent to your email.',
            layout: false,
            title: 'Forget Password',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing password reset request.' });
    }
}

// Xử lý xác thực token và cập nhật mật khẩu mới
async function resetPassword(req, res) {
    const { token, newPassword } = req.body;

    try {
        // Kiểm tra token có hợp lệ không
        const user = await forgetPasswordModel.verifyResetToken(token);
        if (!user) {
            return res.render('reset-password', {
                message: 'Invalid or expired token.',
                layout: false,
                title: 'Reset Password',
            });
        }

        // Cập nhật mật khẩu mới
        await forgetPasswordModel.updatePassword(user.user_id, newPassword);

        // Thông báo người dùng đã cập nhật mật khẩu thành công
        res.render('login', {
            message: 'Password updated successfully, please login.',
            layout: false,
            title: 'Login Page',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error resetting password.' });
    }
}

module.exports = {
    sendResetLink,
    resetPassword,
};
