const forgetPasswordService = require('./forgetpasswordService');
class forgetPasswordController {
    static async requireNewPassword(req, res) {
        let { email } = req.body;
        if (!email) {
            return res.render('forgetPassword', {
                message: 'Email is required.',
                layout: false,
                title: 'Forget Password',
            });
        }
        try {
            email = email.trim();
            const result = await forgetPasswordService.requireNewPassword(email);
            if (result.success) {
                return res.render('forgetPassword', {
                    message: result.message,
                    success: true,
                    layout: false,
                    title: 'Forget Password',
                });
            } else {
                return res.render('forgetPassword', {
                    message: result.message,
                    success: false,
                    layout: false,
                    title: 'Forget Password',
                });
            }
        } catch (error) {
            console.log("Error requireNewPassword in forgetPasswordController: ", error.message);
            return res.render('forgetPassword', {
                message: 'An error occurred. Please try again later.',
                layout: false,
                title: 'Forget Password',
            });
        }

    }
}
module.exports = forgetPasswordController;
