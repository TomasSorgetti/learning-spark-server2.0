const session = require('express-session');
const passport = require('../config/passaport/index');
const { serverConfig } = require('../config');

module.exports = (app) => {
  app.use(
    session({
      secret: serverConfig.SECRET_SESSION,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
};
