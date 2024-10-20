const express = require("express");
const routes = express.Router();

routes.use("/auth", require("./domains/auth/auth.routes"));
routes.use("/user", require("./domains/user/user.routes"));

module.exports = routes;
