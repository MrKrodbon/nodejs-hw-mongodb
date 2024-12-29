export const calculatePaginationData = ({ total, perPage, page }) => {
  const totalItems = total;
  const totalPages = Math.ceil(total / perPage);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    page,
    perPage,
    totalItems,
    totalPages,
    hasPrevPage,
    hasNextPage,
  };
};
