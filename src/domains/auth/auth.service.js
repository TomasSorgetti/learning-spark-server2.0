const { hashPassword, comparePassword } = require('../../common/utils');
const db = require('../../database/index.js');
const { HttpError } = require('../../common/errors');
const { ownerEmail } = require('../../common/config');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
} = require('../../common/services/jwt.service');
const simplifyUser = require('./utils/simplifyUser');
const { verifyEmail } = require('../email/email.service.js');

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
  if (!foundUser) throw new HttpError(404, 'User not found');
  if (foundUser.deleted) throw new HttpError(401, 'User deleted');
  if (!foundUser.verified) throw new HttpError(401, 'User not verified');

  // Verify password
  const validPassword = comparePassword(password, foundUser.password);
  if (!validPassword) throw new HttpError(401, 'Invalid password');

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
  if (foundUser) throw new HttpError(409, 'User already exists');

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

  try {
    const emailToken = generateAccessToken({ id: user.id, email }, false);
    verifyEmail({ name, lastname, email, emailToken });
  } catch (error) {
    console.error('Error al enviar el correo de verificación:', error);
    throw new HttpError(500, 'No se pudo enviar el correo de verificación');
  }

  return simplifyUser(user);
};

const verify = async (emailToken) => {
  const decodedToken = verifyAccessToken(emailToken, (err, user) => {
    if (err) {
      throw new HttpError(403, 'Invalid token');
    } else {
      return user;
    }
  });
  const user = await db.user.findOne({
    where: { id: decodedToken.id },
    include: [
      {
        model: db.role,
        attributes: ['name'],
      },
    ],
  });
  user.verified = true;
  await user.save();

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

const logout = async (res) => {
  res.clearCookie('refreshToken');
  return 'Logout success';
};

module.exports = {
  login,
  register,
  verify,
  profile,
  refresh,
  logout,
};
