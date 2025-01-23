import { OAuth2Client } from 'google-auth-library';
import { getEnvVar } from './getEnvVar.js';
import * as path from 'node:path';
import { readFile } from 'node:fs/promises';
import createHttpError from 'http-errors';

const clientId = getEnvVar('GOOGLE_AUTH_CLIENT_ID');
const clientSecret = getEnvVar('GOOGLE_AUTH_CLIENT_SECRET');
const getOAuthJSONFilePath = path.resolve('google-oauth.json');
const authConfig = JSON.parse(await readFile(getOAuthJSONFilePath, 'utf-8'));
const redirectUri = authConfig.web.redirect_uris[0];

const googleOAuthClient = new OAuth2Client({
  clientId,
  clientSecret,
  redirectUri,
});

export const generateOAuthURL = () => {
  const url = googleOAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
  return url;
};

export const validateCode = async (code) => {
  const response = await googleOAuthClient.getToken(code);
  if (!response?.tokens?.id_token)
    throw createHttpError(401, 'Google OAuth code invalid');

  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });

  return ticket;
};

export const getUsernaemFormGoogleTokenPayload = (payload) => {
  if (payload.name) return payload.name;

  let userName = '';
  if (payload.given_name) userName += payload.given_name;
  if (payload.given_name && payload.family_name)
    userName += ` ${payload.family_name}`;

  if (!payload.given_name) userName += payload.family_name;

  return userName;
};
