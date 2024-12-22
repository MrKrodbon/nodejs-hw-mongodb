export const calculatePaginationData = ({ count, perPage, page }) => {
  const totalPages = Math.ceil(count / perPage);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
};
