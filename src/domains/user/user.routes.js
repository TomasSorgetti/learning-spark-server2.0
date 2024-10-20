const express = require("express");
const userRoutes = express.Router();

userRoutes.get("/", (req, res) => {
  res.send("User Route");
});

module.exports = userRoutes;
