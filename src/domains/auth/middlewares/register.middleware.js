const { sendErrorResponse } = require('../../../common/utils');
const { body, validationResult } = require('express-validator');

const validateSignup = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('The name is required.')
    .isString()
    .withMessage('The name must be a string.'),
  body('lastname')
    .trim()
    .notEmpty()
    .withMessage('The lastname is required.')
    .isString()
    .withMessage('The lastname must be a string.'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('The email is required.')
    .isEmail()
    .withMessage('The email must be a valid email.'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('The password is required.')
    .isLength({ min: 5 })
    .withMessage('The password must be at least 5 characters.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, errors.array(), 400);
    }
    next();
  },
];

module.exports = validateSignup;
