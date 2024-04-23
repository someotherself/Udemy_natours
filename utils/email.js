const nodemailer = require('nodemailer');
const catchAsync = require('./catchAsync');

const sendEmail = catchAsync(async options => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 587,
    secure: false,
    auth: {
      user: '8c2e00807ece40',
      pass: '66142d78ecf51d'
    },
    authMethod: 'LOGIN',
    logger: true,
    debug: true
  });

  // 2) Define email options
  const mailOptions = {
    from: 'Cristian <flexcristi@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };
  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
});

module.exports = sendEmail;
