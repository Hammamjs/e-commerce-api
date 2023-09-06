const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "hamamhussein10@gmail.com",
      pass: process.env.PASS,
    },
  });
  const mailOptions = {
    from: "E-commerce",
    mail: "E-commerce@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
