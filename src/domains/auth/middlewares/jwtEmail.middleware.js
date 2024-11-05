const errorCodes = require('../../../common/errors/errorCodes');
const { verifyAccessToken } = require('../../../common/services/jwt.service');
const { sendErrorResponse } = require('../../../common/utils');

const authenticateJWTEmail = (req, res, next) => {
  const token = req.cookies.emailToken;

  if (!token) {
    return sendErrorResponse(
      res,
      'Email token is required',
      401,
      errorCodes.TOKEN_REQUIRED
    );
  }

  verifyAccessToken(token, (err, user) => {
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

module.exports = { authenticateJWTEmail };
