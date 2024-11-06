const errorCodes = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_DELETED: 'USER_DELETED',
  USER_NOT_VERIFIED: 'USER_NOT_VERIFIED',
  INVALID_PASSWORD: 'INVALID_PASSWORD',

  REGISTERED_WITH_GOOGLE: 'REGISTERED_WITH_GOOGLE',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  USER_ALREADY_VERIFIED: 'USER_ALREADY_VERIFIED',
  INVALID_EMAIL_CODE: 'INVALID_EMAIL_CODE',
  VERIFY_EMAIL_CODE_INVALID: 'VERIFY_EMAIL_CODE_INVALID',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',

  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_REQUIRED: 'TOKEN_REQUIRED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  ADMIN_ROLE_REQUIRED: 'ADMIN_ROLE_REQUIRED',

  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',

  ROLE_ALREADY_EXISTS: 'ROLE_ALREADY_EXISTS',
  NEW_ROLE_ALREADY_EXISTS: 'NEW_ROLE_ALREADY_EXISTS',
};

module.exports = errorCodes;
