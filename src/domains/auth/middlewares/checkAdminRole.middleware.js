const { sendErrorResponse } = require('../../../common/utils');
const errorCodes = require('../../../common/errors/errorCodes');

const checkAdminRole = (req, res, next) => {
  if (req.user && req.user.roles.includes('Admin')) {
    return next();
  }

  return sendErrorResponse(
    res,
    'Admin role required',
    403,
    errorCodes.ADMIN_ROLE_REQUIRED
  );
};

module.exports = checkAdminRole;
