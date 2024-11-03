require('dotenv').config();

const serverConfig = {
  port: process.env.PORT || 8080,
  host: process.env.HOST,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  SERVER_URL: process.env.SERVER_URL || 'http://localhost:8080',
  SECRET_SESSION: process.env.SECRET_SESSION || '123456',
};

module.exports = serverConfig;
