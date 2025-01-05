import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortOrder,
  sortBy,
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * limit;
  const contactsQuery = ContactsCollection.find();

  if (filter.userId) {
    contactsQuery.where('userId').equals(filter.userId);
  }

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  const [items, total] = await Promise.all([
    contactsQuery
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
    await ContactsCollection.countDocuments(filter),
  ]);

  const paginationData = calculatePaginationData({ total, perPage, page });

  return {
    data: items,
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
