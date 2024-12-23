const parsePaginationPage = (number, defaultValue) => {
  const isString = typeof number === 'string';
  if (!isString) {
    return defaultValue;
  }
  if (Number.isNaN(isString)) return defaultValue;
  const parsedNumber = Number.parseInt(number);

  return parsedNumber;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;
  const parsedPage = parsePaginationPage(page, 1);
  const parsedPerPage = parsePaginationPage(perPage, 10);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
