import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/Session.js';
import {
  ACCESS_TOKEN_VALID_UNTIL,
  REFRESH_TOKEN_VALID_UNTIL,
} from '../constants/users.js';

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

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw createHttpError(401, 'Email or password invalid');

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
