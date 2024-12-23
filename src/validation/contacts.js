import Joi from 'joi';

import { TYPE_LIST } from '../constants/contacts.js';

export const contactsAddSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid(...TYPE_LIST)
    .required()
    .default('personal'),
});

export const contactsUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.string().min(3).max(20),
  contactType: Joi.string()
    .min(2)
    .max(20)
    .valid(...TYPE_LIST),
});
