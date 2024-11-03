const express = require('express');
const authRoutes = express.Router();
const controller = require('./auth.controller');
const {
  validateSignup,
  validateSignin,
  authenticateJWT,
  authenticateRefreshJWT,
  authenticateJWTEmail,
} = require('./middlewares');

authRoutes.post('/signin', validateSignin, controller.login);
authRoutes.post('/signup', validateSignup, controller.register);
authRoutes.get('/verify/:emailCode', authenticateJWTEmail, controller.verify);
authRoutes.get('/me', authenticateJWT, controller.profile);
authRoutes.get('/refresh', authenticateRefreshJWT, controller.refresh);
authRoutes.post('/logout', controller.logout);

authRoutes.get('/google', controller.googleLogin);
authRoutes.get('/google/callback', controller.googleCallback);

module.exports = authRoutes;
