require('dotenv').config();

const config = {
  ownerEmail: process.env.OWNER_EMAIL,
  serverConfig: require('./server.config.js'),
  databaseConfig: require('./database.config.js'),
  jwtConfig: require('./jwt.config.js'),
  emailConfig: require('./email.config.js'),
};

module.exports = config;
