import { Router } from 'express';
import * as controllers from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  contactsAddSchema,
  contactsUpdateSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middleware/isValidId.js';
import { validateBody } from '../utils/validateBody.js';

import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(controllers.getAllContactsController));

router.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(controllers.getContactByIdController),
);

router.post(
  '/',
  upload.single('photo'),
  validateBody(contactsAddSchema),
  ctrlWrapper(controllers.createContactController),
);

router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(contactsUpdateSchema),
  ctrlWrapper(controllers.updateContactController),
);

router.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(controllers.deleteContactController),
);

export default router;
