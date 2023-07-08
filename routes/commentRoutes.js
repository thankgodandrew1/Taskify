const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentController');
const { validateRoutes } = require('../utils/projectsAndCommentsRoutesValidation');

module.exports = (commentsCollection) => {
  const {
    getComments,
    getCommentById,
    getCommentsByTags,
    createComment,
    updateComment,
    deleteComment
  } = commentsController(commentsCollection);

  router.get('/', getComments);
  router.get('/:id', getCommentById);

  router.get('tags/:tags', getCommentsByTags);

  router.post('/', validateRoutes('createComment'), createComment);

  router.put('/:id', validateRoutes('updateComment'), updateComment);

  router.delete('/:id', deleteComment);

  return router;
};
