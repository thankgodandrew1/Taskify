const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController');

module.exports = (usersCollection) => {
  const { getUsers, getUserById, getUserByEmail, createUser, updateUser, deleteUser } =
    usersController(usersCollection);

  router.get('/', getUsers);
  router.get('/:id', getUserById);
  router.get('/email/:email', getUserByEmail);
  router.post('/', createUser);
  router.put('/:id', updateUser);
  router.delete('/:id', deleteUser);
  
  return router;
};
