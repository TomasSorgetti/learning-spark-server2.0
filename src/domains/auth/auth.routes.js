const express = require('express');
const authRoutes = express.Router();
const controller = require('./auth.controller');
const { validateSignup, validateSignin } = require('./middlewares');

authRoutes.post('/signin', validateSignin, controller.login);
authRoutes.post('/signup', validateSignup, controller.register);

module.exports = authRoutes;
