import { setupServer } from '../src/server.js';
import { initMongoDB } from './db/initMongoDB.js';
import { createDirIfNotExist } from '../src/utils/createDirIfNotExist.js';
import { TEMP_UPLOAD_DIR, UPLOADS_DIR } from '../src/constants/index.js';

(async () => {
  await initMongoDB();
  await setupServer();

  await createDirIfNotExist(TEMP_UPLOAD_DIR);
  await createDirIfNotExist(UPLOADS_DIR);
})();
