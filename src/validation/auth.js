import Joi from 'joi';
import { EMAIL_REGEXP } from '../constants/users.js';

export const authRegisterSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(EMAIL_REGEXP).required(),
  password: Joi.string().required(),
});

export const authLoginSchema = Joi.object({
  email: Joi.string().pattern(EMAIL_REGEXP).required(),
  password: Joi.string().required(),
});

export const requestResendEmailSchema = Joi.object({
  email: Joi.string().pattern(EMAIL_REGEXP).required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});
