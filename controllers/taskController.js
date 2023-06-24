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

            const task = await tasksCollection.insertOne({
              title: req.body.title,
              description: req.body.description,
              assignee: req.body.assignee,
              status: req.body.status,
              priority: req.body.priority,
              dueDate: req.body.dueDate,
              created_at: req.body.created_at,
              attachments: req.body.attachments,
              tags: req.body.tags
            });
            res.json(task);
      
          } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
          }
    };

    const updateTask = async (req, res) => {
      try {
        const taskId = new ObjectId(req.params.id);
        const task = {
          title: req.body.title,
          description: req.body.description,
          assignee: req.body.assignee,
          status: req.body.status,
          priority: req.body.priority,
          dueDate: req.body.dueDate,
          created_at: req.body.created_at,
          attachments: req.body.attachments,
          tags: req.body.tags
        };
        const response = await mongodb.getDb().db('Taskify').collection('tasks').replaceOne({ _id: taskId }, task);
        console.log(response);
        if (response.modifiedCount > 0) {
          res.status(204).send();
        } else {
          res.status(500).json(response.error || 'Some error occurred while updating this task entry.');
        }
      } catch (err) {
        res.status(500).json(err);
      }
    };

    const deleteTask = async (req, res) => {
      try{
          const taskId = new ObjectId(req.params.id);
          const response = await mongodb.getDb().db('Taskify').collection('tasks').deleteOne({ _id: taskId }, true);
          console.log(response);
          if (response.deletedCount > 0) {
              res.status(204).send();
          } else {
              res.status(500).json(response.error || 'Some error occurred while deleting the task.');
          }
      } catch (err) {
          res.status(500).json(err);
      }
  };

    return{
        getTasks,
        createTask,
        updateTask,
        deleteTask
    }
}