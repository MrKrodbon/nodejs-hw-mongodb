import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { TEMP_UPLOAD_DIR, UPLOADS_DIR } from '../constants/index.js';
import { getEnvVar } from './getEnvVar.js';

export const saveFileToUploadsDir = async (file) => {
  await fs.rename(
    path.join(TEMP_UPLOAD_DIR, file.filename),
    path.join(UPLOADS_DIR, file.filename),
  );
  return `/${file.filename}`;
};
