import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs/promises';

import { getEnvVar } from './getEnvVar.js';

const cloudName = getEnvVar('CLOUDINARY_CLOUD_NAME');
const cloudApiKey = getEnvVar('CLOUDINARY_API_KEY');
const cloadApiSecret = getEnvVar('CLOUDINARY_API_SECRET');

cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudApiKey,
  api_secret: cloadApiSecret,
});

export const saveFileToCloudinary = async (file) => {
  const response = await cloudinary.uploader.upload(file.path, {
    folder: 'posters',
  });
  await fs.unlink(file.path);
  return response.secure_url;
};
