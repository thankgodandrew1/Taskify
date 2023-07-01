const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/taskController');

module.exports = (tasksCollection) => {
    const { getTasks, getTasksByStatus, getTasksByDuedate, createTask, updateTask, deleteTask } =
      tasksController(tasksCollection);
  
    router.get('/', getTasks);
  
    router.get('/:status', getTasksByStatus);
    router.get('/duedate/:duedate', getTasksByDuedate);
    router.post('/', createTask);
    router.put('/:id', updateTask);
    router.delete('/:id', deleteTask);
  
    return router;
};
