import { TEMP_UPLOAD_DIR } from '../constants/index.js';
import createHttpError from 'http-errors';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: TEMP_UPLOAD_DIR,
  filename: (req, file, cb) => {
    const uniquePreffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const fileName = `${uniquePreffix}_${file.originalname}`;
    cb(null, fileName);
  },
});

const limits = { fileSize: 1024 * 1024 * 5 };

const fileFilter = (req, file, cb) => {
  const extension = file.originalname.split('.').pop();
  if (extension === 'exe') {
    return cb(createHttpError(400, 'file with .exe extension not allow'));
  }

  cb(null, true);
};

export const upload = multer({ storage, limits, fileFilter });
