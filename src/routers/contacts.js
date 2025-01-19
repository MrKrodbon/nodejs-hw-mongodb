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

router.get('/contacts', ctrlWrapper(controllers.getAllContactsController));

router.get(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(controllers.getContactByIdController),
);

router.post(
  '/contacts',
  upload.single('poster'),
  validateBody(contactsAddSchema),
  ctrlWrapper(controllers.createContactController),
);

router.patch(
  '/contacts/:contactId',
  isValidId,
  upload.single('poster'),
  validateBody(contactsUpdateSchema),
  ctrlWrapper(controllers.updateContactController),
);

router.delete(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(controllers.deleteContactController),
);

export default router;
