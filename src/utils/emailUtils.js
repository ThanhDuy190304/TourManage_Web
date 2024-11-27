const nodemailer = require('nodemailer'); // Gửi email

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

    const ENV_URL = process.env.NODE_ENV === 'production'
        ? process.env.PRODUCTION_URL // URL production
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
    } catch (error) {
        console.error('Error sending verification email:', error);
    }

}

module.exports = {
    sendVerificationEmail
};