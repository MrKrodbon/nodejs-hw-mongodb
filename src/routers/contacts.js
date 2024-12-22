import { Router } from 'express';
import * as controllers from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  contactsAddSchema,
  contactsUpdateSchema,
} from '../../validation/contacts.js';
import { validateBody } from '../utils/validateBody.js';
import { isValidId } from '../middleware/isValidId.js';

const router = Router();

router.get(
  '/contacts',
  validateBody(contactsAddSchema),
  ctrlWrapper(controllers.getAllContactsController),
);

router.get(
  '/contacts/:contactId',
  isValidId,
  validateBody(contactsUpdateSchema),
  ctrlWrapper(controllers.getContactByIdController),
);

router.post('/contacts', ctrlWrapper(controllers.createContactController));

router.patch(
  '/contacts/:contactId',
  ctrlWrapper(controllers.updateContactController),
);

router.delete(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(controllers.deleteContactController),
);

export default router;
