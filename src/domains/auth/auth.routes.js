const express = require('express');
const authRoutes = express.Router();
const controller = require('./auth.controller');
const validateSignup = require('./middlewares/register.middleware');

authRoutes.get('/signin', controller.login);
authRoutes.get('/signup', validateSignup, controller.register);

module.exports = authRoutes;
