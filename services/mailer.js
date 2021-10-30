const nodemailer = require('nodemailer');

async function send(to, subject, content){
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth:{
            user: "webhiendaihcb02@gmail.com",
            pass: "a0943361873",
        },
        // tls: {
        //     // do not fail on invalid certs
        //     rejectUnauthorized: false,
        //   },
        requireTLS: true,
    });
    
    return transporter.sendMail({
        from: "daugiatudong@gmail.com",
        to,
        subject,
        text: content,
    }).then(console.log).catch(console.error);
}

module.exports = {send};