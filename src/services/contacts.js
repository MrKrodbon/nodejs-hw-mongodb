import { ContactsCollection } from '../db/models/contacts.js';
import calculatePaginationData from '../utils/calculatePaginationData';

export const getAllContacts = async () => {
  const limit = perPage;
  const skip = (page - 1) * limit;
  const items = await ContactsCollection.find().skip(skip).limit(limit);
  const total = await ContactsCollection.countDocuments();
  const paginationData = calculatePaginationData({ total, page, perPage });
  return {
    items,
    total,
    ...paginationData,
  };
};

export const getContactById = async (contactId) => {
  const contacts = await ContactsCollection.findById(contactId);
  return contacts;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);

  return contact;
};

export const updateContact = async (_id, payload) => {
  const contact = await ContactsCollection.findOneAndUpdate({ _id }, payload, {
    new: true,
  });
  return contact;
};

export const deleteContact = async (_id) => {
  const contact = await ContactsCollection.findOneAndDelete({ _id });

  return contact;
};
