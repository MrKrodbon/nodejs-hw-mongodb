import { Schema, model } from 'mongoose';
import { EMAIL_REGEXP } from '../../constants/users.js';
import { handleSaveError } from './hooks.js';
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      match: EMAIL_REGEXP,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

userSchema.post('save', handleSaveError);

export const UserCollection = model('user', userSchema);
