const { hashPassword, comparePassword } = require('../../common/utils');
const db = require('../../database/index.js');
const { HttpError, errorCodes } = require('../../common/errors');
const { ownerEmail } = require('../../common/config');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../../common/services/jwt.service');
const simplifyUser = require('./utils/simplifyUser');
const { verifyEmail } = require('../email/email.service.js');
const generateRandomNumber = require('../../common/utils/generateNumber.js');

const login = async ({ email, password, rememberMe }) => {
  // Find user
  const foundUser = await db.user.findOne({
    where: { email },
    include: [
      {
        model: db.role,
        attributes: ['name'],
      },
    ],
  });
  if (!foundUser)
    throw new HttpError(404, errorCodes.USER_NOT_FOUND, 'User not found');
  if (foundUser.deleted)
    throw new HttpError(401, errorCodes.USER_DELETED, 'User deleted');
  if (!foundUser.verified)
    throw new HttpError(401, errorCodes.USER_NOT_VERIFIED, 'User not verified');

  // Verify password
  const validPassword = comparePassword(password, foundUser.password);
  if (!validPassword)
    throw new HttpError(401, errorCodes.INVALID_PASSWORD, 'Invalid password');

  // Generate tokens
  const accessToken = generateAccessToken(
    { id: foundUser.id, email },
    rememberMe
  );
  const refreshToken = generateRefreshToken(
    { id: foundUser.id, email },
    rememberMe
  );

  // Return simplified user && tokens
  return { accessToken, refreshToken, user: simplifyUser(foundUser) };
};

const register = async ({ email, password, name, lastname }) => {
  // Find user
  const foundUser = await db.user.findOne({ where: { email } });
  // if user already exists or is verified throw error
  if (foundUser && !foundUser.deleted && foundUser.verified)
    throw new HttpError(
      409,
      errorCodes.USER_ALREADY_EXISTS,
      'User already exists'
    );

  // Search if user is already registered and not verified
  // TODO => si el usuario no esta verificado y expiró el codigo de verificación, debería  generar otro y reenviar el email?
  // if (foundUser && !foundUser.verified) {

  // }

  const hashedPassword = hashPassword(password);

  // Create user
  const user = await db.user.create({
    name,
    lastname,
    email,
    password: hashedPassword,
  });

  // Add role
  const isOwner = email === ownerEmail;
  const role = await db.role.findOne({
    where: { name: isOwner ? 'Owner' : 'User' },
  });
  if (!role) throw new HttpError(500, 'Role not found');
  await user.addRole(role);
  await user.reload({
    include: [
      {
        model: db.role,
        as: 'roles',
      },
    ],
  });

  // TODO => preguntar si el usuario es owner, si es owner, no debe enviar email de verificación
  // Add expiration code email date
  if (!isOwner) {
    // Set expiration date
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);

    // Generate email code
    const emailCode = generateRandomNumber();

    // Save email code
    const emailVerification = await db.emailVerification.create({
      emailCode,
      expirationDate,
      userId: user.id,
    });
    if (!emailVerification)
      throw new HttpError(500, 'Email verification not created');

    // Send mail
    try {
      verifyEmail({ name, lastname, email, emailCode });
    } catch (error) {
      throw new HttpError(500, errorCodes.INTERNAL_SERVER_ERROR, error.message);
    }

    const emailToken = generateAccessToken({ id: user.id, email });
    return { user: simplifyUser(user), emailToken };
  }

  return { user: simplifyUser(user) };
};

const verify = async (user, emailCode) => {
  const foundUser = await db.user.findOne({
    where: { id: user.id },
  });
  if (!foundUser)
    throw new HttpError(404, errorCodes.USER_NOT_FOUND, 'User not found');
  if (foundUser.deleted)
    throw new HttpError(400, errorCodes.USER_DELETED, 'User deleted');
  if (foundUser.verified)
    throw new HttpError(
      400,
      errorCodes.USER_ALREADY_VERIFIED,
      'User already verified'
    );
  // TODO => compare emailCode with user.emailCode
  console.log(emailCode, foundUser.emailCode);

  if (foundUser.emailCode !== emailCode) {
    throw new HttpError(
      400,
      errorCodes.INVALID_EMAIL_CODE,
      'Invalid email code'
    );
  }
  foundUser.verified = true;
  await foundUser.save();

  return simplifyUser(user);
};

const profile = async (user) => {
  const userFound = await db.user.findOne({
    where: { id: user.id },
    include: [
      {
        model: db.role,
        attributes: ['name'],
      },
    ],
  });
  return simplifyUser(userFound);
};

const refresh = async (user) => {
  const userFound = await db.user.findOne({
    where: { id: user.id },
    include: [
      {
        model: db.role,
        attributes: ['name'],
      },
    ],
  });
  const accessToken = generateAccessToken({
    id: userFound.id,
    email: userFound.email,
  });
  const refreshToken = generateRefreshToken({
    id: userFound.id,
    email: userFound.email,
  });

  return { accessToken, refreshToken, simplifiedUser: simplifyUser(userFound) };
};

const clearSession = async (res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    sameSite: 'none',
    secure: 'Lax',
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'none',
    secure: 'Lax',
  });
  return 'Logout successful';
};

module.exports = {
  login,
  register,
  verify,
  profile,
  refresh,
  clearSession,
};
