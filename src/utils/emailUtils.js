const nodemailer = require('nodemailer'); // Gửi email
require('dotenv').config();

async function sendVerificationEmail(email, token) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const ENV_URL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : process.env.PRODUCTION_URL // URL production;

    const mailOptions = {
        from: 'neyduc167@gmail.com',
        to: email,
        subject: 'Email Verification',
        html: `Please verify your email by clicking on the following link: <br>
        <a href="${ENV_URL}/verify/${token}">${ENV_URL}/verify/${token}</a>`
    };
    try {
        // Gửi email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error);
    }

}
async function sendNewPassword(email, newPassword) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }

    })
    const mailOptions = {
        from: 'neyduc167@gmail.com',
        to: email,
        subject: 'Your New Password',
        html: `<p>Your new password is: <strong>${newPassword}</strong></p>`
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Error sending email');
    }
}
module.exports = {
    sendVerificationEmail,
    sendNewPassword,
};