const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');

const generateAccessToken = (payload, rememberMe = false) => {
  const expiresIn = rememberMe
    ? 60 * 60 * 24 * 7
    : parseInt(jwtConfig.accessExpires) * 60;

  return jwt.sign(payload, jwtConfig.accessSecret, { expiresIn });
};

const generateRefreshToken = (payload, rememberMe = false) => {
  const expiresIn = rememberMe
    ? 30 * 24 * 60 * 60
    : parseInt(jwtConfig.refreshExpires) * 24 * 60 * 60;

  return jwt.sign(payload, jwtConfig.refreshSecret, { expiresIn });
};

const verifyAccessToken = (token, cb) => {
  return jwt.verify(token, jwtConfig.accessSecret, cb);
};
const verifyRefreshToken = (token, cb) => {
  return jwt.verify(token, jwtConfig.refreshSecret, cb);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
