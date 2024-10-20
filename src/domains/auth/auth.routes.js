const express = require("express");
const authRoutes = express.Router();

authRoutes.get("/login", (req, res) => {
  res.send("Login Route");
});

module.exports = authRoutes;
