const loginModel = require('./loginModel');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');


async function loginUser(req, res) {
    const { Username_Email, password } = req.body;// Lấy thông tin từ form đăng nhập

    try {

        // lấy người dùng dựa trên csdl
        const user = await loginModel.loginUser(Username_Email);

        if (!user) {
            return res.render(
                'login', {
                message: 'Invalid username/email or password.',
                layout: false,
                title: 'Login Page',
            }
            );
        }

        const passwordMatch = await argon2.verify(user.user_password, password);//coi database nha

        if (!passwordMatch) {
            return res.render('login',
                {
                    message: 'Invalid username/email or password.',
                    layout: false,
                    title: 'Login Page',
                }
            )
        }

        console.log('successful');

        const token = jwt.sign(
            {
                user_id: user.user_id,
                user_name: user.user_name,
                email: user.email,
            },
            process.env.JWT_SECRET, // Khóa bí mật cho JWT
            { expiresIn: '1h' } // Token hết hạn sau 1 giờ
        );

        res.cookie('auth_token', token, { httpOnly: true }); // Lưu token vào cook
        res.redirect('/');

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Login Unsuccessfully' });
    }

}

module.exports = {
    loginUser,
}