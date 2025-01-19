import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/User.js';
import { SessionCollection } from '../db/models/Session.js';
import {
  ACCESS_TOKEN_VALID_UNTIL,
  REFRESH_TOKEN_VALID_UNTIL,
} from '../constants/users.js';

import jwt from 'jsonwebtoken';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendMail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

const getTokenToReset = (user, email) => {
  return jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );
};

const generateTokens = () => {
  return {
    accessToken: randomBytes(30).toString('base64'),
    refreshToken: randomBytes(30).toString('base64'),
  };
};

const createSession = () => {
  const { accessToken, refreshToken } = generateTokens();

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_VALID_UNTIL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_VALID_UNTIL),
  };
};

export const registerUser = async (payload) => {
  const { email, password } = payload;

  const isKnownEmail = await UserCollection.findOne({ email: email });

  if (isKnownEmail) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(password, 10);

  const newUser = await UserCollection.create({
    ...payload,
    password: encryptedPassword,
  });

  return newUser;
};

export const loginUser = async (payload) => {
  const { email, password } = payload;

  const user = await UserCollection.findOne({ email: email });

  if (!user) throw createHttpError(401, 'Email or password invalid');

  const isPasswordEqual = await bcrypt.compare(password, user.password);

  if (!isPasswordEqual) throw createHttpError(401, 'Email or password invalid');

  await SessionCollection.deleteOne({
    userId: user.id,
  });

  const session = createSession();

  return await SessionCollection.create({
    userId: user.id,
    ...session,
  });
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(404, 'Session not found');
  }

  const isSessionExpired = Date.now() > session.refreshTokenValidUntil;

  if (isSessionExpired) throw createHttpError(401, 'Session expired');

  await SessionCollection.deleteOne({ _id: sessionId });
  const newSession = createSession();

  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email: email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = getTokenToReset(user, email);

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendMail({
    from: getEnvVar(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html: html,
  });
};

export const logoutUserSesion = async ({ sessionId }) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const getSession = (filter) => {
  const session = SessionCollection.findOne(filter);

  return session;
};

export const getUser = (filter) => {
  const user = UserCollection.findOne(filter);
  return user;
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (error) {
    if (error instanceof Error) throw createHttpError(401, error.message);
  }

  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) throw createHttpError(404, 'User not found');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UserCollection.updateOne(
    {
      _id: user._id,
    },
    {
      password: encryptedPassword,
    },
  );
};
