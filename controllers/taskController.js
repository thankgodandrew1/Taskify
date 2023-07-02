const { ObjectId } = require('mongodb');

module.exports = (tasksCollection) => {
  const getTasks = async (req, res) => {
    try {
      const tasks = await tasksCollection.find({}).toArray();
      res.json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };

  const createTask = async (req, res) => {
    try {
      const { title, description, assignee, status, priority, attachments, tags, dueDate } =
        req.body;

      const task = await tasksCollection.insertOne({
        title: title,
        description: description,
        assignee: assignee,
        status: status,
        priority: priority,
        dueDate: new Date(dueDate),
        created_at: new Date(),
        attachments: attachments,
        tags: tags
      });

      res.status(201).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };

  const updateTask = async (req, res) => {
    try {
      const taskId = new ObjectId(req.params.id);
      const { title, description, assignee, status, priority, attachments, tags, dueDate } =
        req.body;

      const task = await tasksCollection.insertOne({
        title: title,
        description: description,
        assignee: assignee,
        status: status,
        priority: priority,
        dueDate: new Date(dueDate),
        created_at: new Date(),
        attachments: attachments,
        tags: tags
      });
      const response = await tasksCollection.replaceOne({ _id: taskId }, task);
      console.log(response);
      if (response.modifiedCount > 0) {
        res.status(204).send();
      } else {
        res
          .status(500)
          .json(response.error || 'Some error occurred while updating this task entry.');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };

  const deleteTask = async (req, res) => {
    try {
      const taskId = new ObjectId(req.params.id);
      const response = await tasksCollection.deleteOne({ _id: taskId }, true);
      console.log(response);
      if (response.deletedCount > 0) {
        res.status(200).send();
      } else {
        res.status(500).json(response.error || 'Some error occurred while deleting the task.');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };

  const getTasksByStatus = async (req, res) => {
    try {
      const task = await tasksCollection.findOne({ status: req.params.status });

      if (!task) {
        return res.status(404).send('Task not found');
      }
      res.json(task);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };

  const getTasksByDuedate = async (req, res) => {
    try {
      const { dueDate } = req.params;
      const taskDueDate = await tasksCollection.find({ dueDate: new Date(dueDate) }).toArray();

      if (taskDueDate.length === 0) {
        return res.status(404).json({ message: 'No tasks found with the specified dueDate' });
      }
      res.json(taskDueDate);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };

  return {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    getTasksByStatus,
    getTasksByDuedate
  };
};
