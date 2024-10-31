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
  const foundUser = await db.user.findOne({
    where: { email },
  });
  // if user already exists or is verified throw error
  if (foundUser && !foundUser.deleted && foundUser.verified) {
    throw new HttpError(
      409,
      errorCodes.USER_ALREADY_EXISTS,
      'User already exists'
    );
  }

  const hashedPassword = hashPassword(password);

  // Search if user is already registered and not verified
  if (foundUser && !foundUser.verified) {
    const emailExpiration = await db.emailVerification.findOne({
      where: { userId: foundUser.id },
    });
    console.log('emailExpiration: ', emailExpiration);

    if (emailExpiration && emailExpiration.emailCodeExpires < Date.now()) {
      // Generate new email code && expiration
      const emailCode = generateRandomNumber();
      const emailCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

      // Update email verification
      await db.emailVerification.update(
        {
          emailCode,
          emailCodeExpires,
        },
        { where: { userId: foundUser.id } }
      );
      await db.user.update(
        {
          password: hashPassword(password),
          name,
          lastname,
        },
        { where: { id: foundUser.id } }
      );

      // Send mail
      try {
        verifyEmail({ name, lastname, email, emailCode });
      } catch (error) {
        throw new HttpError(
          500,
          errorCodes.INTERNAL_SERVER_ERROR,
          error.message
        );
      }

      const emailToken = generateAccessToken({ id: foundUser.id, email });
      return { user: simplifyUser(foundUser), emailToken };
    } else {
      throw new HttpError(
        500,
        errorCodes.INTERNAL_SERVER_ERROR,
        'Internal server error'
      );
    }
  } else {
    // if user doesn't exist
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

    // Set expiration date
    const emailCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

    // Generate email code
    const emailCode = generateRandomNumber();

    // Save email code
    const emailVerification = await db.emailVerification.create({
      emailCode,
      emailCodeExpires,
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

    // TODO => si debería generar el token, en /verify debería ver si es owner o no y darle accesso directo
    const emailToken = generateAccessToken({ id: user.id, email });
    return { user: simplifyUser(user), emailToken };
  }
};

const verify = async (user, emailCode) => {
  // Find user
  const foundUser = await db.user.findOne({
    where: { id: user.id },
    include: [
      {
        model: db.role,
        as: 'roles',
        attributes: ['name'],
      },
    ],
  });

  // if invalid user throw error
  if (!foundUser) {
    throw new HttpError(404, errorCodes.USER_NOT_FOUND, 'User not found');
  }
  if (foundUser.deleted) {
    throw new HttpError(400, errorCodes.USER_DELETED, 'User deleted');
  }
  if (foundUser.verified) {
    // throw new HttpError(
    //   400,
    //   errorCodes.USER_ALREADY_VERIFIED,
    //   'User already verified'
    // );
    return simplifyUser(foundUser);
  }

  // Search if user is already registered and not verified
  const emailExpiration = await db.emailVerification.findOne({
    where: { userId: foundUser.id },
  });

  if (!emailExpiration) {
    throw new HttpError(
      500,
      errorCodes.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  } else {
    // if email code is expired throw error
    if (emailExpiration.emailCodeExpires < Date.now()) {
      throw new HttpError(
        400,
        errorCodes.VERIFY_EMAIL_EXPIRED,
        'Verify email expired'
      );
    } else if (emailExpiration.emailCode != emailCode) {
      // if email code is invalid throw error
      throw new HttpError(
        400,
        errorCodes.VERIFY_EMAIL_CODE_INVALID,
        'Verify email code invalid'
      );
    } else {
      // update user as verified
      await db.user.update({ verified: true }, { where: { id: foundUser.id } });
      // delete email code
      // await db.emailVerification.destroy({ where: { userId: foundUser.id } });
      return simplifyUser(foundUser);
    }
  }
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
