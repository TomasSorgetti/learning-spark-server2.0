const { sendSuccessResponse } = require('../../common/utils');
const service = require('./auth.service');
const passport = require('passport');

const login = async (req, res, next) => {
  const { email, password, rememberMe } = req.body;
  try {
    const { accessToken, refreshToken } = await service.login({
      email,
      password,
      rememberMe,
    });
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: 'Lax', // for localhost
      maxAge: rememberMe
        ? 90 * 24 * 60 * 60 * 1000 // 90 días en milisegundos
        : 30 * 24 * 60 * 60 * 1000, // 30 días en milisegundos
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: 'Lax',
      maxAge: rememberMe
        ? 90 * 24 * 60 * 60 * 1000 // 90 días en milisegundos
        : 30 * 24 * 60 * 60 * 1000, // 30 días en milisegundos
    });

    res.cookie('isAuthenticated', 'true', {
      httpOnly: false,
      sameSite: 'none',
      secure: 'Lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(`${process.env.CLIENT_URL}`);
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
    if (data) {
      res.clearCookie('emailToken', {
        httpOnly: true,
        sameSite: 'none',
        secure: 'Lax',
      });
    }
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
    sendSuccessResponse(res, 200, 'Refresh token success', simplifiedUser);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
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
    res.clearCookie('isAuthenticated', {
      httpOnly: false,
      sameSite: 'none',
      secure: 'Lax',
    });
    sendSuccessResponse(res, 200, 'Logout success');
  } catch (error) {
    next(error);
  }
};

const googleLogin = async (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })(req, res, next);
};

const googleCallback = async (req, res, next) => {
  passport.authenticate(
    'google',
    { failureRedirect: '/' },
    async (err, user, info) => {
      console.log('CALLBACK INFO', info);

      if (err || !user) {
        console.log('CALLBACK ERROR', err);

        return res.redirect(`${process.env.CLIENT_URL}/auth/login`);
      }
      try {
        const { accessToken, refreshToken } =
          await service.handleGoogleLogin(user);

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

        res.cookie('isAuthenticated', 'true', {
          httpOnly: false,
          sameSite: 'none',
          secure: 'Lax',
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return res.redirect(`${process.env.CLIENT_URL}`);
      } catch (error) {
        next(error);
      }
    }
  )(req, res);
};

module.exports = {
  login,
  register,
  verify,
  profile,
  refresh,
  logout,
  googleLogin,
  googleCallback,
};
