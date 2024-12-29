import * as services from '../services/auth.js';

export const registerController = async (req, res, next) => {
  const data = await services.registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: data,
  });
};

export const loginController = async (req, res, next) => {
  const data = await services.loginUser(req.body);

  console.log(data);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: data,
  });
};
