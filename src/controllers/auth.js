import * as services from '../services/auth.js';
import { generateOAuthURL } from '../utils/googleOAuth2.0.js';

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

export const registerController = async (req, res) => {
  const registeredUser = await services.registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: registeredUser,
  });
};

export const loginController = async (req, res) => {
  const session = await services.loginUser(req.body);

  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: { accessToken: session.accessToken },
  });
};

export const refreshController = async (req, res) => {
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
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const logoutController = async (req, res) => {
  const { sessionId } = req.cookies;

  await services.logoutUserSesion({ sessionId });

  res.status(204).send();
};

export const resetPasswordController = async (req, res) => {
  await services.resetPassword(req.body);

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};

export const getGoogleOauthUrlController = async (req, res) => {
  const url = await generateOAuthURL();

  res.json({
    status: 200,
    message: 'Succesfullty get OAuth url',
    data: {
      url,
    },
  });
};

export const loginWithGoogleController = async (req, res) => {
  const { code } = req.body;

  const session = await services.loginOrRegisterWithGoogle(code);

  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in a user with Google!',
    data: { accessToken: session.accessToken },
  });
};
