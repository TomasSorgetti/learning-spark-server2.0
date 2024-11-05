const express = require('express');
const userRoutes = express.Router();
const { authenticateJWT } = require('../auth/middlewares');

userRoutes.put(
  '/change-password',
  authenticateJWT,
  require('./user.controller').changePassword
);

module.exports = userRoutes;
