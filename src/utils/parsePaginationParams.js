const parsePaginationPage = (number, defaultValue) => {
  const isString = typeof number === 'string';
  if (Number.isNaN(isString)) return defaultValue;
  const parsedNumber = Number.parseInt(number);

  return parsedNumber;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;
  const parsedPage = parsePaginationPage(page);
  const parsedPerPage = parsePaginationPage(perPage);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
