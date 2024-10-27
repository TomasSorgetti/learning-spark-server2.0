require('dotenv').config();

const serverConfig = {
  port: process.env.PORT || 8080,
  host: 'localhost',
  get serverUrl() {
    return `http://${this.host}:${this.port}`;
  },
};

module.exports = serverConfig;
