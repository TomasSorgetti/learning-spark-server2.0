const errorCodes = require('../../../common/errors/errorCodes');
const { verifyRefreshToken } = require('../../../common/services/jwt.service');
const { sendErrorResponse } = require('../../../common/utils');

const authenticateRefreshJWT = (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return sendErrorResponse(
      res,
      'Refresh token is required',
      401,
      errorCodes.TOKEN_REQUIRED
    );
  }

  verifyRefreshToken(token, (err, user) => {
    if (err) {
      return sendErrorResponse(
        res,
        'Invalid token',
        403,
        errorCodes.INVALID_TOKEN
      );
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateRefreshJWT };
