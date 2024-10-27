const { hashPassword, comparePassword } = require('../../common/utils');
const db = require('../../database/index.js');
const { HttpError } = require('../../common/errors');
const { ownerEmail } = require('../../common/config');

const login = async ({ email, password }) => {
  // Find user
  const foundUser = await db.user.findOne({ where: { email } });
  if (!foundUser) throw new HttpError(404, 'User not found');
  if (!foundUser.deleted) throw new HttpError(401, 'User not active');

  // Verify password
  const validPassword = comparePassword(password, foundUser.password);
  if (!validPassword) throw new HttpError(401, 'Invalid password');

  
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

  // TODO => send email to verify

  // Return simplified user
  const userSimplified = { ...user.dataValues };
  delete userSimplified.password;
  return userSimplified;
};

const profile = async () => {
  const users = await db.user.findAll({ include: ['roles'] });
  return users;
};

module.exports = {
  login,
  register,
  profile,
};
