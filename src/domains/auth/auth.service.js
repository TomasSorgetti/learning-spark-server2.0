const { hashPassword } = require('../../common/utils');
const db = require('../../database/index.js');
const { HttpError } = require('../../common/errors');

const login = async () => {
  return 'Login service';
};
const register = async ({ email, password, name, lastname }) => {
  const foundUser = await db.user.findOne({ where: { email } });
  if (foundUser) throw new HttpError(409, 'User already exists');

  const hashedPassword = hashPassword(password);

  const user = await db.user.create({
    name,
    lastname,
    email,
    password: hashedPassword,
  });
  if (!user) throw new HttpError(500, 'Internal server error');

  const userSimplified = { ...user.dataValues };
  delete userSimplified.password;
  return userSimplified;
};

module.exports = {
  login,
  register,
};
