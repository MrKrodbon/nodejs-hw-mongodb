import { Router } from 'express';
import * as controllers from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/contacts', ctrlWrapper(controllers.getAllContactsController));

router.get(
  '/contacts/:contactId',
  ctrlWrapper(controllers.getContactByIdController),
);

router.post('/contacts', ctrlWrapper(controllers.createContactController));

router.patch(
  '/contacts/:contactId',
  ctrlWrapper(controllers.updateContactController),
);

router.delete(
  '/contacts/:contactId',
  ctrlWrapper(controllers.deleteContactController),
);

export default router;
