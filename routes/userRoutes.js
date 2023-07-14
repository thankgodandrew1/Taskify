const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController');
const { validateRoutes } = require('../utils/tasksAndUsersRoutesValidation');
const isAuthenticated = require('../middlewares/authentication');

module.exports = (usersCollection) => {
  const { getUsers, getUserById, getUserByEmail, createUser, updateUser, deleteUser } =
    usersController(usersCollection);

  router.use(isAuthenticated);
  router.get('/', getUsers);
  router.get('/:id', getUserById);
  router.get('/email/:email', getUserByEmail);
  router.post('/', validateRoutes('createUser'), createUser);
  router.put('/:id', validateRoutes('updateUser'), updateUser);
  router.delete('/:id', deleteUser);

  return router;
};
