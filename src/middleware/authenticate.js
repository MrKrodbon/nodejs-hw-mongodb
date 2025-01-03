import createHttpError from 'http-errors';
import { getSession, getUser } from '../services/auth.js';

export const authenticate = async (req, res, next) => {
  const authorization = req.get('Authorization');

  if (!authorization) {
    return next(
      createHttpError(401, 'Header must have an authorization token'),
    );
  }

  const [bearer, accessToken] = authorization.split(' ');

  if (bearer !== 'Bearer') {
    return next(createHttpError(401, 'Header must be Bearer type'));
  }

  const session = await getSession({ accessToken: accessToken });

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  const isSessionExpired = Date.now() > session.accessTokenValidUntil;

  if (isSessionExpired) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await getUser({ _id: session.userId });

  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  next();
};
