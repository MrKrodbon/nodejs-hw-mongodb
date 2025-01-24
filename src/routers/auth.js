import { Router } from 'express';
import { validateBody } from '../utils/validateBody.js';
import {
  authLoginSchema,
  authRegisterSchema,
  googleOAuthValidateSchema,
  requestResendEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import * as controllers from '../controllers/auth.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(authRegisterSchema),
  ctrlWrapper(controllers.registerController),
);

authRouter.post(
  '/login',
  validateBody(authLoginSchema),
  ctrlWrapper(controllers.loginController),
);

authRouter.post('/refresh', ctrlWrapper(controllers.refreshController));

authRouter.post('/logout', ctrlWrapper(controllers.logoutController));

authRouter.post(
  '/send-reset-email',
  validateBody(requestResendEmailSchema),
  ctrlWrapper(controllers.requestResetEmailController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(controllers.resetPasswordController),
);

authRouter.get(
  '/get-oauth-url',
  ctrlWrapper(controllers.getGoogleOauthUrlController),
);

authRouter.post(
  '/config-oauth',
  validateBody(googleOAuthValidateSchema),
  ctrlWrapper(controllers.loginWithGoogleController),
);
