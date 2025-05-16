// 📂 backend/utils/emailService.js
require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS

    }
});

async function sendPurchaseEmail(to, lotteryNumber, productName, pdfPath) {
    const mailOptions = {
        from: 'dineshbaghana@gmail.com',
        to,
        subject: 'Your Purchase Confirmation & Lottery Number',
        text: `Thank you for your purchase!\n\nProduct: ${productName}\nLottery Number: ${lotteryNumber}`,
        attachments: [
            {
                filename: `${productName}.pdf`,
                path: pdfPath
            }
        ]
    };

    await transporter.sendMail(mailOptions);
    console.log('📨 Email sent successfully to:', to);
}

module.exports = { sendPurchaseEmail };
