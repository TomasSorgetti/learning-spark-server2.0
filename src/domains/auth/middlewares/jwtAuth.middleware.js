const errorCodes = require('../../../common/errors/errorCodes');
const { verifyAccessToken } = require('../../../common/services/jwt.service');
const { sendErrorResponse } = require('../../../common/utils');

const authenticateJWT = (req, res, next) => {
  // const token = req.headers['authorization']?.split(' ')[1];
  const token = req.cookies.accessToken;
  if (!token) {
    return sendErrorResponse(
      res,
      'Access token is required',
      401,
      errorCodes.TOKEN_REQUIRED
    );
  }

  verifyAccessToken(token, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return sendErrorResponse(
          res,
          'Access token has expired',
          401,
          errorCodes.TOKEN_EXPIRED
        );
      } else {
        return sendErrorResponse(
          res,
          'Invalid token',
          403,
          errorCodes.INVALID_TOKEN
        );
      }
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateJWT };
