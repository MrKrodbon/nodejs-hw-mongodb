import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotnev from 'dotenv';

import router from './routers/contacts.js';
import { getContactByIdController } from './controllers/contacts.js';
import { ctrlWrapper } from './utils/ctrlWrapper.js';

dotnev.config();
const PORT = Number(process.env.PORT);

export const setupServer = () => {
  const app = express();

  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.listen(PORT, () => {
    console.log("it's work!");
  });

  router.get('/contacts', ctrlWrapper(getAllContactsController));

  router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

  app.use('*', (req, res) => {
    res.status(404).json({ message: 'Page not found' });
  });
};
