const {
  sendErrorResponse,
  sendSuccessResponse,
} = require('../../common/utils');
const service = require('./auth.service');

const login = async (req, res) => {
  try {
    const data = await service.login();
    sendSuccessResponse(res, 200, 'Login success', data);
  } catch (error) {
    sendErrorResponse(res, error.message, error.status);
  }
};
const register = async (req, res) => {
  const { email, password, name, lastname } = req.body;
  try {
    const data = await service.register({ email, password, name, lastname });
    sendSuccessResponse(res, 200, 'Register success', data);
  } catch (error) {
    sendErrorResponse(res, error.message, error.status);
  }
};
const profile = async (req, res) => {
  try {
    const data = await service.profile();
    sendSuccessResponse(res, 200, 'Profile success', data);
  } catch (error) {
    sendErrorResponse(res, error.message, error.status);
  }
};

module.exports = {
  login,
  register,
  profile,
};
