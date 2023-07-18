const { validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');

module.exports = (commentsCollection) => {
  const getComments = async (req, res) => {
    try {
      const comments = await commentsCollection.find({}).toArray();
      res.json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };

  const getCommentById = async (req, res) => {
    try {
      const comment = await commentsCollection.findOne({ _id: new ObjectId(req.params.id) });
      if (!comment) {
        return res.status(404).send('Comment not found');
      }
      res.json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };

  const createComment = async (req, res) => {
    try {
      // This Check for any validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { taskId, userId, text, likes, replies, tags } = req.body;
      const comment = await commentsCollection.insertOne({
        taskId: taskId,
        userId: userId,
        text: text,
        likes: likes,
        replies: replies,
        tags: tags,
        edited: null,
        created_at: new Date()
      });
      res.json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };

  const updateComment = async (req, res) => {
    try {
      // This Check for any validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const commentId = new ObjectId(req.params.id);
      const { text, tags } = req.body;

      const updatedComment = await commentsCollection.findOneAndUpdate(
        { _id: commentId },
        { $set: { text: text, tags: tags, edited: new Date() } },
        { returnOriginal: false }
      );

      if (updatedComment) {
        res.status(204).send();
      } else {
        res.status(500).json('Some error occurred while updating this comment entry.');
      }
    } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
  };
  const deleteComment = async (req, res) => {
    try {
      const commentId = new ObjectId(req.params.id);
      const deletedComment = await commentsCollection.deleteOne({ _id: commentId }, true);
      console.log(deletedComment);
      if (deletedComment.deletedCount > 0) {
        res.status(204).send();
      } else {
        res
          .status(500)
          .json(deletedComment.error || 'Some error occurred while deleting the comment.');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };
  return {
    getComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment
  };
};
