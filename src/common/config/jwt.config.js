require('dotenv').config();

const jwtConfig = {
  accessSecret: process.env.ACCESS_SECRET,
  accessExpires: process.env.ACCESS_EXPIRES,

  refreshSecret: process.env.REFRESH_SECRET,
  refreshExpires: process.env.REFRESH_EXPIRES,
};

module.exports = jwtConfig;
