const { sanitizeInput, hashPassword } = require("../../common/utils");
const db = require("../../database/connection");
const { HttpError } = require("../../common/errors");

const login = async () => {
  return "Login service";
};
const register = async ({ email, password, name, lastname }) => {
  const {
    name: cleanName,
    lastname: cleanLastname,
    email: cleanEmail,
    password: cleanPassword,
  } = sanitizeInput({ name, lastname, email, password });

  const foundUser = await db.user.findOne({ where: { email: cleanEmail } });
  if (foundUser) throw new HttpError(409, "User already exists");
  const hashedPassword = hashPassword(cleanPassword);

  const user = await db.user.create({
    name: cleanName,
    lastname: cleanLastname,
    email: cleanEmail,
    password: hashedPassword,
  });
  if (!user) throw new HttpError(500, "Internal server error");

  const userSimplified = { ...user.dataValues };
  delete userSimplified.password;
  return userSimplified;
};

module.exports = {
  login,
  register,
};
