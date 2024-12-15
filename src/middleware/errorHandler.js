export const errorHandler = (error, req, res, next) => {
  const { status = 404 } = error;
  res.status(404).json({
    message: {
      status,
      message: 'Contact not found',
    },
  });
};
