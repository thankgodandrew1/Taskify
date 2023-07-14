const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectController');
const { validateRoutes } = require('../utils/projectsAndCommentsRoutesValidation');
const isAuthenticated = require('../middlewares/authentication');

module.exports = (projectsCollection) => {
  const { getProjects, getProjectById, createProject, updateProject, deleteProject } =
    projectsController(projectsCollection);

  router.use(isAuthenticated);
  router.get('/', getProjects);
  router.get('/:id', getProjectById);
  router.post('/', validateRoutes('projectsRoute'), createProject);
  router.put('/:id', validateRoutes('projectsRoute'), updateProject);
  router.delete('/:id', deleteProject);

  return router;
};
