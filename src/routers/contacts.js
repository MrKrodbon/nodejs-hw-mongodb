import { Router } from 'express';

const router = Router();

router.get('/contacts', async (req, res, next) => {
  const data = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: data,
  });
});

export default router;
