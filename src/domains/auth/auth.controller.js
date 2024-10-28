const {
  sendErrorResponse,
  sendSuccessResponse,
} = require('../../common/utils');
const service = require('./auth.service');

const login = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  try {
    const { accessToken, refreshToken, user } = await service.login({
      email,
      password,
      rememberMe,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000,
    });
    sendSuccessResponse(res, 200, 'Login success', { accessToken, user });
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

const verify = async (req, res) => {
  const { emailToken } = req.params;

  try {
    const data = await service.verify(emailToken);
    sendSuccessResponse(res, 200, 'Verify email success', data);
  } catch (error) {
    sendErrorResponse(res, error.message, error.status);
  }
};

const profile = async (req, res) => {
  const { user } = req;

  try {
    const data = await service.profile(user);
    sendSuccessResponse(res, 200, 'Profile success', data);
  } catch (error) {
    sendErrorResponse(res, error.message, error.status);
  }
};

const refresh = async (req, res) => {
  const { user } = req;
  try {
    const { accessToken, refreshToken, simplifiedUser } =
      await service.refresh(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 30 * 60 * 1000,
    });
    sendSuccessResponse(res, 200, 'Refresh token success', {
      accessToken,
      user: simplifiedUser,
    });
  } catch (error) {
    sendErrorResponse(res, error.message, error.status);
  }
};

const logout = async (req, res) => {
  try {
    const response = await service.logout(res);
    sendSuccessResponse(res, 200, response);
  } catch (error) {
    sendErrorResponse(res, error.message, error.status);
  }
};

module.exports = {
  login,
  register,
  verify,
  profile,
  refresh,
  logout,
};
