const nodemailer = require('nodemailer');

async function send(to, subject, content){
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth:{
            user: 'hotlinescambank@gmail.com',
            pass: 'scammymoney123',
        }
    });
    
    return transporter.sendMail({
        from: 'hotlinescambank@gmail.com',
        to,
        subject,
        text: content,
    }).then(console.log).catch(console.error);
}

module.exports = {send};