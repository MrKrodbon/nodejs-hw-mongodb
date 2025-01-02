import * as services from '../services/auth.js';

const setupSession = (res, session) => {
  res.cookie('sessionId', session.sessionId, {
    httpOnly: true,
    expires: new Date(Date.now() + new Date(REFRESH_TOKEN_VALID_UNTIL)),
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + new Date(REFRESH_TOKEN_VALID_UNTIL)),
  });
};

export const registerController = async (req, res, next) => {
  const data = await services.registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: data,
  });
};

export const loginController = async (req, res, next) => {
  const session = await services.loginUser(req.body);

  res.cookie('sessionId', session.id, { httpOnly: true });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: session.accessToken,
  });
};

export const refreshController = async (req, res, next) => {
  const session = await services.refreshUsersSession({
    refreshToken: req.cookies.refreshToken,
    sessionId: req.cookies.sessionId,
  });

  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: session.accessToken,
  });
};
