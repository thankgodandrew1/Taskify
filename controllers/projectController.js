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
            const project = await projectsCollection.insertOne({
              title: req.body.title,
              description: req.body.description,
              manager: req.body.manager,
              status: req.body.status,
              teamMembers: req.body.teamMembers,
              tasks: req.body.tasks,
              progress: req.body.progress
            });
            res.json(project);
      
          } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
          }
    };

    const deleteProject = async (req, res) => {
        try{
            const projectId = new ObjectId(req.params.id);
            const response = await mongodb.getDb().db('Taskify').collection('projects').deleteOne({ _id: projectId }, true);
            console.log(response);
            if (response.deletedCount > 0) {
                res.status(204).send();
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
        createProject
    };
};

    
