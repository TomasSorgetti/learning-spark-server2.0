require('dotenv').config();

const config = {
  ownerEmail: process.env.OWNER_EMAIL,
  serverConfig: require('./server.config.js'),
  databaseConfig: require('./database.config.js'),
};

module.exports = config;
