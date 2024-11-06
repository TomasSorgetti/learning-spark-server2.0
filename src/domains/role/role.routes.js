const express = require('express');
const roleRoutes = express.Router();
const { authenticateJWT, checkAdminRole } = require('../auth/middlewares');

roleRoutes.get(
  '/',
  authenticateJWT,
  checkAdminRole,
  require('./role.controller').getAllRoles
);
roleRoutes.post(
  '/',
  authenticateJWT,
  checkAdminRole,
  require('./role.controller').createRole
);
roleRoutes.put(
  '/:name',
  authenticateJWT,
  checkAdminRole,
  require('./role.controller').updateRole
);
roleRoutes.delete(
  '/:id',
  authenticateJWT,
  checkAdminRole,
  require('./role.controller').deleteRole
);

module.exports = roleRoutes;
