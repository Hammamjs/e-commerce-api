const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_SERVICE_PROVIDER,
      pass: process.env.PASS_SERVICE_PROVIDER,
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
