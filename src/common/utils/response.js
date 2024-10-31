// const errorCodes = require('../errors/errorCodes');

const sendSuccessResponse = (res, status = 200, message, data = {}) => {
  res.status(status).json({
    success: true,
    message,
    data,
  });
};

const sendErrorResponse = (
  res,
  message,
  statusCode = 500,
  errorCode = 'INTERNAL_SERVER_ERROR'
) => {
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    errorCode,
  });
};

module.exports = {
  sendSuccessResponse,
  sendErrorResponse,
};
