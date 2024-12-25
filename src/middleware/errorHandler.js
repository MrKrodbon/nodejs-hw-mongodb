export const errorHandler = (error, req, res, next) => {
  const { status = 500 } = error;
  res.status(500).json({
    status,
    message: 'Something went wrong',
    data: error.message,
  });
};
