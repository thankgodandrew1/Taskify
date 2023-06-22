const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/taskController');

router.get('/', tasksController.getTasks);
//router.get('/:status', tasksController.getTasksByStatus);
//router.get('/:duedate', tasksController.getTasksByDuedate);
//router.post('/', tasksController.createTask);
//router.put('/:id', tasksController.updateTask);
//router.delete('/:id', tasksController.deleteTask);

module.exports = router;

