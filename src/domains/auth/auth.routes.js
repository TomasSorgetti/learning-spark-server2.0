const express = require('express');
const authRoutes = express.Router();
const controller = require('./auth.controller');

authRoutes.get('/signin', controller.login);
authRoutes.get('/signup', controller.register);

module.exports = authRoutes;
