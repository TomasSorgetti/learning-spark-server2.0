const { sendErrorResponse } = require('../utils');
const { HttpError } = require('./customErrors');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    sendErrorResponse(res, err.message, err.status, err.code);
  } else {
    sendErrorResponse(res, 'Internal Server Error', 500);
  }
};

module.exports = errorHandler;
