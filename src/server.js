import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotnev from 'dotenv';
import { getAllContacts, getContactById } from './services/contacts.js';

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

  app.get('/contacts', async (req, res, next) => {
    const data = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: data,
    });
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    const { contactId } = req.params;

    const data = await getContactById(contactId);
    if (!data) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: data,
    });
  });

  app.use('*', (req, res) => {
    res.status(404).json({ message: 'Page not found' });
  });
};
