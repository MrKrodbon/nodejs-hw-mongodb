import { SORT_ORDER, SORT_BY } from '../constants/contacts.js';

const parseSortOrder = (sortOrder) => {
  const isKnownSortOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(
    sortOrder,
  );

  return isKnownSortOrder ? sortOrder : SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
  const isKnowSortBy = SORT_BY.includes(sortBy);

  return isKnowSortBy ? sortBy : '_id';
};

export const parsedSortOrderParams = (query) => {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);

  const parsedSortBy = parseSortBy(sortBy);

  return { sortOrder: parsedSortOrder, sortBy: parsedSortBy };
};
