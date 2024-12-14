import { getAllContacts, getContactById } from './services/contacts.js';

export const getAllContactsController = async () => {
  const data = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: data,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }

    const data = await getContactById(contactId);
    if (!data) {
      res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
    }
    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
