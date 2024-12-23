import { model, Schema } from 'mongoose';
import { TYPE_LIST } from '../../constants/contacts.js';

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      requiered: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: TYPE_LIST,
      required: true,
      default: 'personal',
    },
  },
  { versionKey: false, timestamps: true },
);

export const ContactsCollection = model('contacts', contactsSchema);
