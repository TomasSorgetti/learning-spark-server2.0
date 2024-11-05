const db = require('../../database/index.js');
const { HttpError, errorCodes } = require('../../common/errors');
const { comparePassword, hashPassword } = require('../../common/utils');

const changePassword = async ({ user, password, newPassword }) => {
  const foundUser = await db.user.findOne({ where: { email: user.email } });
  if (!foundUser) {
    throw new HttpError(404, errorCodes.USER_NOT_FOUND, 'User not found');
  }
  if (foundUser.deleted) {
    throw new HttpError(400, errorCodes.USER_DELETED, 'User deleted');
  }
  if (!foundUser.verified) {
    throw new HttpError(400, errorCodes.USER_NOT_VERIFIED, 'User not verified');
  }
  if (foundUser.authMethod !== 'password') {
    throw new HttpError(
      401,
      errorCodes.REGISTERED_WITH_GOOGLE,
      `User registered with ${foundUser.authMethod}`
    );
  }

  const validPassword = comparePassword(password, foundUser.password);
  if (!validPassword) {
    throw new HttpError(401, errorCodes.INVALID_PASSWORD, 'Invalid password');
  }
  const newHashedPassword = hashPassword(newPassword);
  foundUser.password = newHashedPassword;
  return await foundUser.save();
};

module.exports = { changePassword };
