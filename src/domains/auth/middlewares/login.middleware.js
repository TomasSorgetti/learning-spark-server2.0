const { sendErrorResponse } = require('../../../common/utils');
const { body, validationResult } = require('express-validator');

const validateSignin = [
  body('email').trim().notEmpty().withMessage('The email is required.'),
  body('password').trim().notEmpty().withMessage('The password is required.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, errors.array(), 400);
    }
    next();
  },
];

module.exports = {validateSignin};
