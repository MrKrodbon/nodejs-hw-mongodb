import { Router } from 'express';
import { validateBody } from '../utils/validateBody.js';
import {
  authLoginSchema,
  authRegisterSchema,
  requestResendEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
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

authRouter.post('/auth/refresh', ctrlWrapper(controllers.refreshController));

authRouter.post('/auth/logout', ctrlWrapper(controllers.logoutController));

authRouter.post(
  '/auth/send-reset-email',
  validateBody(requestResendEmailSchema),
  ctrlWrapper(controllers.requestResetEmailController),
);

authRouter.post(
  '/auth/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(controllers.resetPasswordController),
);
