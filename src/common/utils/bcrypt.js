const bcrypt = require("bcrypt");

/**
 * Receives a password and return a hashed password
 * @param {*} password
 * @returns
 */
const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

/**
 * Compares a password with a hashed password
 * @param {*} password
 * @param {*} hash
 * @returns
 */
const comparePassword = (password, userPassword) => {
  return bcrypt.compareSync(password, userPassword);
};

module.exports = { hashPassword, comparePassword };
