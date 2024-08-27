const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "sigurd.collins9@ethereal.email",
    pass: "daTKMzxXXHAK4rHsTY",
  },
});

async function sendMail(mail, subject, text) {
    const mailOptions = {
        from: '"El Pablo 👻" <sigurd.collins9@ethereal.email>',
        to: mail,
        subject: subject,
        text: text,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return info;
}

module.exports = {
    sendMail
}