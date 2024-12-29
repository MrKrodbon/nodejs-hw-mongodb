import { Router } from 'express';
import { validateBody } from '../utils/validateBody.js';
import { authLoginSchema, authRegisterSchema } from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import * as controllers from '../controllers/auth.js';

export const authRouter = Router();

authRouter.post(
  '/auth/register',
  validateBody(authRegisterSchema),
  ctrlWrapper(controllers.registerController),
);

authRouter.post(
  '/auth/login',
  validateBody(authLoginSchema),
  ctrlWrapper(controllers.loginController),
);
