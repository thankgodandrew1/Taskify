const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/taskController');
const { validateRoutes } = require('../utils/tasksAndUsersRoutesValidation');
const isAuthenticated = require('../middlewares/authentication');

module.exports = (tasksCollection) => {
  const controller = tasksController(tasksCollection);

  router.use(isAuthenticated);
  router.get('/', controller.getTasks);
  router.get('/:status', controller.getTasksByStatus);
  router.get('/dueDate/:dueDate', controller.getTasksByDuedate);
  router.post('/', validateRoutes('taskRoutes'), controller.createTask);
  router.put('/:id', validateRoutes('taskRoutes'), controller.updateTask);
  router.delete('/:id', controller.deleteTask);

  return router;
};
