const { sendSuccessResponse } = require('../../common/utils');
const service = require('./auth.service');

const login = async (req, res, next) => {
  const { email, password, rememberMe } = req.body;
  try {
    const { accessToken, refreshToken, user } = await service.login({
      email,
      password,
      rememberMe,
    });
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: 'Lax', // for localhost
      maxAge: rememberMe
        ? 15 * 24 * 60 * 60 * 1000 // 15 days
        : 15 * 60 * 1000, // 15 minutes
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: 'Lax',
      maxAge: rememberMe
        ? 90 * 24 * 60 * 60 * 1000 // 90 días en milisegundos
        : 30 * 24 * 60 * 60 * 1000, // 30 días en milisegundos
    });
    sendSuccessResponse(res, 200, 'Login success', { user });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  const { email, password, name, lastname } = req.body;
  try {
    const { user, emailToken } = await service.register({
      email,
      password,
      name,
      lastname,
    });
    res.cookie('emailToken', emailToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: 'Lax',
      maxAge: 15 * 60 * 1000,
    });
    sendSuccessResponse(res, 200, 'Register success', user);
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  const { emailCode } = req.params;
  const { user } = req;
  try {
    const data = await service.verify(user, emailCode);
    sendSuccessResponse(res, 200, 'Verify email success', data);
  } catch (error) {
    next(error);
  }
};

const profile = async (req, res, next) => {
  const { user } = req;

  try {
    const data = await service.profile(user);
    sendSuccessResponse(res, 200, 'Profile success', data);
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  const { user } = req;
  try {
    const { accessToken, refreshToken, simplifiedUser } =
      await service.refresh(user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: 'Lax',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: 'Lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    sendSuccessResponse(res, 200, 'Refresh token success', {
      user: simplifiedUser,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const response = await service.clearSession(res);
    sendSuccessResponse(res, 200, response);
  } catch (error) {
    next(error);
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
