import createHttpError from 'http-errors';
import * as services from '../services/contacts.js';
import mongoose from 'mongoose';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parsedSortOrderParams } from '../utils/parseSortOrderParams.js';

export const getAllContactsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parsedSortOrderParams(req.query);

  const data = await services.getAllContacts({
    page,
    perPage,
    sortOrder,
    sortBy,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    createHttpError(404, 'Contact not found');
  }

  const data = await services.getContactById(contactId);
  if (!data) throw createHttpError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data,
  });
};

export const createContactController = async (req, res, next) => {
  const contact = await req.body;
  const data = await services.createContact(contact);

  console.log(validationResult);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: data,
  });
};

export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const data = await services.updateContact(contactId, req.body);

  if (!data) throw createHttpError(404, 'Contact not found');

  res.status(201).json({
    status: 201,
    message: 'Successfully patched a contact!',
    data,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const data = await services.deleteContact(contactId);

  if (!data) throw createHttpError(404, 'Contact not found');

  res.status(204).send();
};
