require('dotenv').config();

const emailConfig = {
  emailService: process.env.EMAIL_SERVICE,
  email: process.env.EMAIL_NAME,
  emailPassword: process.env.EMAIL_PASSWORD,
};

module.exports = emailConfig;
