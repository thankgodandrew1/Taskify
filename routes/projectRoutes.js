const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectController');
const { validateRoutes } = require('../utils/projectsAndCommentsRoutesValidation');

module.exports = (projectsCollection) => {
  const { getProjects, getProjectById, createProject, updateProject, deleteProject } =
    projectsController(projectsCollection);

  router.get('/', getProjects);
  router.get('/:id', getProjectById);
  router.post('/', validateRoutes('projectsRoute'), createProject);
  router.put('/:id', validateRoutes('projectsRoute'), updateProject);
  router.delete('/:id', deleteProject);

  return router;
};
