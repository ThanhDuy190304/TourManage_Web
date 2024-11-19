const loginModel = require('./loginModel');
const argon2 = require('argon2');

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

        req.session.user = {
            user_id: user.user_id,
            user_name: user.user_name,
            email: user.email,
        }

        //chuyển hướng
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