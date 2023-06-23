// Dependencies
const nodemailer = require('nodemailer');

// nodemailer setup
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: 'sabbirto13@gmail.com',
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(mailOptions);
};

// export
module.exports = sendEmail;
