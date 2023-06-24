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
    }

    return{
        getTasks,
        createTask
    }
}