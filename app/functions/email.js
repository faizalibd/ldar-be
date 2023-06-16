const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
});

exports.sendMail = (from, to, cc, subject, text, html) => {
    let mail = { from: from, to: to, subject: subject };
    if (cc) {
        mail.cc = cc;
    }

    if (text) {
        mail.text = text;
    }

    if (html) {
        mail.html = html;
    }
    transporter.sendMail(mail, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
