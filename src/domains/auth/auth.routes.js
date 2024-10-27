const express = require('express');
const authRoutes = express.Router();
const controller = require('./auth.controller');
const { validateSignup, validateSignin } = require('./middlewares');

authRoutes.post('/signin', validateSignin, controller.login);
authRoutes.post('/signup', validateSignup, controller.register);
authRoutes.get('/me', controller.profile);

module.exports = authRoutes;
