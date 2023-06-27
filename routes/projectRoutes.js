const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectController');

module.exports = (projectsCollection) => {
  const { getProjects, getProjectById, createProject, updateProject, deleteProject } =
    projectsController(projectsCollection);

  router.get('/', getProjects);

  router.get('/:id', getProjectById);

  //router.post('/', createProject);

  //router.put('/:id', updateProject);

  //router.delete('/:id', deleteProject);

  return router;
};
