import createHttpError from 'http-errors';
import * as services from '../services/contacts.js';
import mongoose from 'mongoose';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parsedSortOrderParams } from '../utils/parseSortOrderParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadsDir } from '../utils/saveFileToUploadsDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parsedSortOrderParams(req.query);
  const filter = parseFilterParams(req.query);
  const { _id: userId } = req.user;
  filter.userId = userId;

  const data = await services.getAllContacts({
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId))
    throw createHttpError(404, 'Contact not found');

  const data = await services.getContactById(contactId, userId);

  if (!data) throw createHttpError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data,
  });
};

const saveToCloudinaryFeatureFlag = async (photo, isCloudinaryEnable) => {
  let photoUrl;
  if (isCloudinaryEnable) {
    photoUrl = await saveFileToCloudinary(photo);
  } else {
    photoUrl = await saveFileToUploadsDir(photo);
  }

  return photoUrl;
};

export const createContactController = async (req, res) => {
  const contact = await req.body;
  let photo = req.file;
  let photoUrl = null;
  let isCloudinaryEnable = getEnvVar('CLOUDINARY_ENABLE');

  if (photo) {
    photoUrl = await saveToCloudinaryFeatureFlag(photo, isCloudinaryEnable);
  }

  const { _id: userId } = req.user;

  const data = await services.createContact({
    ...contact,
    photo: photoUrl,
    userId,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: data,
  });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  let photo = req.file;
  let photoUrl;
  let isCloudinaryEnable = getEnvVar('CLOUDINARY_ENABLE');

  if (photo) {
    photoUrl = await saveToCloudinaryFeatureFlag(photo, isCloudinaryEnable);
  }

  const data = await services.updateContact(
    contactId,
    userId,
    photoUrl,
    req.body,
  );

  if (!data) throw createHttpError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const data = await services.deleteContact(contactId, userId);

  if (!data) throw createHttpError(404, 'Contact not found');

  res.status(204).send();
};
