import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/Session.js';
import {
  ACCESS_TOKEN_VALID_UNTIL,
  REFRESH_TOKEN_VALID_UNTIL,
} from '../constants/users.js';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_VALID_UNTIL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_VALID_UNTIL),
  });
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

  const passwordCompare = bcrypt.compare(password, user.password);
  if (!passwordCompare) throw createHttpError(401, 'Email or password invalid');

  await SessionCollection.deleteOne({
    userId: user._id,
  });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_VALID_UNTIL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_VALID_UNTIL),
  });
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    userId: sessionId,
    refreshToken,
  });

  if (!session) createHttpError(404, 'Session not found');

  const isSessionExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionExpired) createHttpError(401, 'Session expired');

  const newUser = createSession();

  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });

  return await {
    userId: session.userId,
    ...newUser,
  };
};
