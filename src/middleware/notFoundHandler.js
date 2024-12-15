export const notFountHandler = (req, res) => {
  res.status(404).json({ message: 'Page not found' });
};
