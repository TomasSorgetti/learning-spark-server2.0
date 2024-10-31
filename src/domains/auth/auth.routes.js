const express = require('express');
const authRoutes = express.Router();
const controller = require('./auth.controller');
const {
  validateSignup,
  validateSignin,
  authenticateJWT,
  authenticateRefreshJWT,
} = require('./middlewares');

authRoutes.post('/signin', validateSignin, controller.login);
authRoutes.post('/signup', validateSignup, controller.register);
authRoutes.get('/verify/:emailToken', controller.verify);
authRoutes.get('/me', authenticateJWT, controller.profile);
authRoutes.get('/refresh', authenticateRefreshJWT, controller.refresh);

module.exports = authRoutes;
