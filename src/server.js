import express, { json } from 'express';
import cors from 'cors';
import dotnev from 'dotenv';
import contactsRouter from './routers/contacts.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './routers/auth.js';
import cookieParser from 'cookie-parser';
import { UPLOADS_DIR } from './constants/index.js';

dotnev.config();
const PORT = Number(process.env.PORT);

export const setupServer = () => {
  const app = express();

  app.use(cors());

  app.use(cookieParser());

  app.use(express.json());

  app.use(logger);

  app.listen(PORT, () => {
    console.log(`it's work on PORT ${PORT}!`);
  });

  app.use(authRouter);
  app.use('/uploads', express.static(UPLOADS_DIR));

  app.use(contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);
};
