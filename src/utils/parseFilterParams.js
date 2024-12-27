import { TYPE_LIST } from '../constants/contacts.js';

const parseNumber = (number) => {
  const isString = typeof number === 'string';

  if (!isString) return;

  const parsedNumber = Number.parseInt(number);

  if (Number.isNaN(parsedNumber)) return;

  return parsedNumber;
};

const parseTypeList = (typeList) => {
  const isString = typeof typeList === 'string';

  if (!isString) return;

  const parsedTypeList = (typeList) =>
    ['work', 'home', 'personal'].includes(typeList);

  if (parsedTypeList(typeList)) return typeList;
};

export const parseFilterParams = (query) => {
  const { contactType } = query;

  const parsedContactType = parseTypeList(contactType);

  return {
    contactType: parsedContactType,
  };
};
