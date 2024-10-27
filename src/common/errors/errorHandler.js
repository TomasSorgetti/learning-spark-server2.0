const { sendErrorResponse } = require('../utils');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); 
  sendErrorResponse(res, 500, err.message || 'Internal Server Error');
};

module.exports = errorHandler;
