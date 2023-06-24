const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/taskController');

module.exports = (tasksCollection) => {
    const { getTasks, getTasksByStatus, getTasksByDuedate, createTask, updateTask, deleteTask } =
      tasksController(tasksCollection);
  
    router.get('/', getTasks);
  
    //router.get('/:status', tasksController.getTasksByStatus);
    //router.get('/:duedate', tasksController.getTasksByDuedate);
    router.post('/', tasksController.createTask);
    //router.put('/:id', tasksController.updateTask);
    //router.delete('/:id', tasksController.deleteTask);
  
    return router;
};
