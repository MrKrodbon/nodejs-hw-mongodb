import * as services from '../services/auth.js';

const setupSession = (res, session) => {
  res.cookie('sessionId', session.id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};

export const registerController = async (req, res, next) => {
  const registeredUser = await services.registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: registeredUser,
  });
};

export const loginController = async (req, res, next) => {
  const session = await services.loginUser(req.body);

  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: { accessToken: session.accessToken },
  });
};

export const refreshController = async (req, res, next) => {
  const { refreshToken, sessionId } = req.cookies;

  const session = await services.refreshUsersSession({
    sessionId: sessionId,
    refreshToken: refreshToken,
  });

  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: session.accessToken },
  });
};

export const requestResetEmailController = async (req, res) => {
  await services.requestResetToken(req.body.email);

  res.json({
    status: 200,
    message: 'Reset password email was successfully sent!',
    data: {},
  });
};

export const logoutController = async (req, res, next) => {
  const { sessionId } = req.cookies;

  await services.logoutUserSesion({ sessionId });

  res.status(204).send();
};

export const resetPasswordController = async (req, res, next) => {
  await services.resetPassword(req.body);

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
