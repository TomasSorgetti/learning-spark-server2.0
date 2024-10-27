const { verifyAccessToken } = require('../../../common/services/jwt.service');
const { sendErrorResponse } = require('../../../common/utils');

const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return sendErrorResponse(res, { message: 'Access token is required' }, 401);
  }

  verifyAccessToken(token, (err, user) => {
    if (err) {
      return sendErrorResponse(res, { message: 'Invalid token' }, 403);
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateJWT };
