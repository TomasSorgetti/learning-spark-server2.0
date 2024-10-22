const express = require("express");
const authRoutes = express.Router();
const controller = require("./auth.controller");

authRoutes.get("/login", controller.login);

module.exports = authRoutes;
