require('dotenv').config();

const serverConfig = {
  port: process.env.PORT || 8080,
  host: process.env.HOST,
  serverUrl: process.env.BACKEND_URL,
  frontendUrl: process.env.FRONTEND_URL,
};

module.exports = serverConfig;
