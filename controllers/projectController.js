const { ObjectId } = require('mongodb');

module.exports = (projectsCollection) => {
  const getProjects = async (req, res) => {
    try {
      const projects = await projectsCollection.find({}).toArray();
      res.json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };

  const getProjectById = async (req, res) => {
    try {
      const project = await projectsCollection.findOne({ _id: new ObjectId(req.params.id) });
      if (!project) {
        return res.status(404).send('Project not found');
      }
      res.json(project);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };

  const createProject = async (req, res) => {
    try {
      const {
        title,
        description,
        manager,
        status,
        startDate,
        dueDate,
        teamMembers,
        tasks,
        progress
      } = req.body;

      const project = await projectsCollection.insertOne({
        title: title,
        description: description,
        manager: manager,
        status: status,
        startDate: new Date(startDate),
        dueDate: new Date(dueDate),
        teamMembers: teamMembers,
        tasks: tasks,
        progress: progress,
        created_at: new Date()
      });
      res.status(201).json(project);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };

  const updateProject = async (req, res) => {
    try {
      const projectId = new ObjectId(req.params.id);
      const {
        title,
        description,
        manager,
        status,
        startDate,
        dueDate,
        teamMembers,
        tasks,
        progress
      } = req.body;

      const project = await projectsCollection.insertOne({
        title: title,
        description: description,
        manager: manager,
        status: status,
        startDate: new Date(startDate),
        dueDate: new Date(dueDate),
        teamMembers: teamMembers,
        tasks: tasks,
        progress: progress,
        created_at: new Date()
      });
      const response = await projectsCollection.replaceOne({ _id: projectId }, project);
      console.log(response);
      if (response.modifiedCount > 0) {
        res.status(204).send();
      } else {
        res
          .status(500)
          .json(response.error || 'Some error occurred while updating this project entry.');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };

  const deleteProject = async (req, res) => {
    try {
      const projectId = new ObjectId(req.params.id);
      const response = await projectsCollection.deleteOne({ _id: projectId }, true);
      console.log(response);
      if (response.deletedCount > 0) {
        res.status(200).send();
      } else {
        res.status(500).json(response.error || 'Some error occurred while deleting the project.');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };

  return {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
  };
};
