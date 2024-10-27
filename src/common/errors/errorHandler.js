const { sendErrorResponse } = require('../utils');

const errorHandler = (err, req, res) => {
  sendErrorResponse(res, 'Internal server error', 500, err.message);
};

module.exports = errorHandler;
