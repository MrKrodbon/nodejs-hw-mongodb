import createHttpError from 'http-errors';
import { SWAGGER_PATH } from '../constants/index.js';
import fs from 'node:fs';
import swaggerUI from 'swagger-ui-express';

export const swaggerDocs = () => {
  try {
    console.log(SWAGGER_PATH, '!!!!!!!!!!!!!!');

    const docs = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString());
    console.log('docs', docs);

    return [...swaggerUI.serve, ...swaggerUI.setup(docs)];
  } catch (error) {
    return (req, res, next) => {
      next(createHttpError(500, 'Cannot load docs'));
    };
  }
};
