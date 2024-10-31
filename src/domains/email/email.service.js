const { emailConfig } = require('../../common/config');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: emailConfig.emailService,
  auth: {
    user: emailConfig.email,
    pass: emailConfig.emailPassword,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const verifyEmail = ({ name, lastname, email, emailCode }) => {
  // eslint-disable-next-line no-undef
  const filePath = path.join(__dirname, './templates/emailVerification.html');
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebars.compile(source);
  const replacements = { name, lastname, emailCode };
  const htmlToSend = template(replacements);

  const mailOptions = {
    from: emailConfig.email,
    replyTo: email,
    to: email,
    subject: 'Please verify your account',
    html: htmlToSend,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw new Error(error.message);
    } else {
      console.log('Email sent', info.response);
      return 'Email sent' + info.response;
    }
  });
};

module.exports = {
  verifyEmail,
};
