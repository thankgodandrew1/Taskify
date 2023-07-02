const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/taskController');

module.exports = (tasksCollection) => {
  const controller = tasksController(tasksCollection); // Call the controller function to get the controller object

  router.get('/', controller.getTasks);
  router.get('/:status', controller.getTasksByStatus);
  router.get('/dueDate/:dueDate', controller.getTasksByDuedate);
  router.post('/', controller.createTask);
  router.put('/:id', controller.updateTask);
  router.delete('/:id', controller.deleteTask);

  return router;
};
