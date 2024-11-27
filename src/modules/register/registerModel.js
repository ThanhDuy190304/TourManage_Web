const db = require('../../config/db'); // Giả sử bạn có một tệp db.js để kết nối với cơ sở dữ liệu
const crypto = require('crypto'); // Tạo mã xác nhận
const nodemailer = require('nodemailer'); // Gửi email
const argon2 = require('argon2');


async function sendVerificationEmail(email, token){
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth:{
            user: 'neyduc167@gmail.com',
            pass: 'uprd ayye gixw alzf' 
        }
    })

    const ENV_URL = process.env.NODE_ENV === 'production'
    ? 'https://tadtravels-duy-thanhs-projects.vercel.app' // URL production
    : 'http://localhost:3000'; // URL local development

    const mailOptions = {
        from: 'neyduc167@gmail.com',
        to: email,
        subject: 'Email Verification',
        text: `Please verify your email by clicking on the following link:  
        ${ENV_URL}/verify/${token}`
    }

    try {
        // Gửi email
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent!');
    } catch (error) {
        console.error('Error sending verification email:', error);
    }

}

async function registerUser(userName, email, encryptionPassword) {

    try{
        // Kiểm tra tài khoản đã tồn tại chưa
        const checkUser = 'SELECT * FROM users WHERE user_name = $1 OR email = $2';
        const result = await db.query(checkUser, [userName, email]);

        if(result.rowCount > 0){
            if (result.rows.some(row => row.user_name === userName)) {
                throw new Error('Username already exists.');
            }
            if (result.rows.some(row => row.email === email)) {
                throw new Error('Email already exists.');
            }
        }

        const checkUnverifiedUser = 'SELECT * FROM pending_users WHERE user_name = $1 OR email = $2';
        const result1 = await db.query(checkUnverifiedUser,[userName, email]);
        if(result1.rowCount > 0){
            if (result1.rows.some(row => row.user_name === userName)) {
                throw new Error('Username already exists.');
            }
            if (result1.rows.some(row => row.email === email)) {
                throw new Error('Email already exists.');
            }
        }

        const verificationToken = crypto.randomBytes(20).toString('hex');

        // Nếu tên người dùng chưa tồn tại, thực hiện chèn người dùng mới vào bảng tạm
        const query = 'INSERT INTO pending_users (user_name, email, user_password, verfication_token) VALUES ($1, $2, $3, $4)';
        await db.query(query, [userName, email, encryptionPassword, verificationToken]);

        await sendVerificationEmail(email,verificationToken);
    }
    catch(error){
        console.error(error);
        throw new Error(error.message);
    }

}

module.exports = {
    registerUser,
};
