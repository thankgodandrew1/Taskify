const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentController');

module.exports = (commentsCollection) => {
  const { getComments, getCommentById, getCommentsByTags, createComment, updateComment, deleteComment } =
    commentsController(commentsCollection);

  router.get('/', getComments);
  router.get('/:id', getCommentById);

  //router.get('/:tags', getCommentsByTags);

  router.post('/', createComment);

  router.put('/:id', updateComment);

  router.delete('/:id', deleteComment);

  return router;
};