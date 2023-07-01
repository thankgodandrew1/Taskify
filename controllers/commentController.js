const { ObjectId } = require('mongodb');

module.exports = (commentsCollection) => {
    const getComments = async(req, res) => {
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
        const comment = await commentsCollection.insertOne({
          taskId: req.body.taskId,
          userId: req.body.userId,
          text: req.body.text,
          likes: req.body.likes,
          replies: req.body.replies,
          edited: req.body.edited,
          deleted: req.body.deleted
        });
        res.json(comment);
  
      } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
      }
    };

    const updateComment = async (req, res) => {
        try {
          const commentId = new ObjectId(req.params.id);
          const comment = {
            taskId: req.body.taskId,
            userId: req.body.userId,
            text: req.body.text,
            likes: req.body.likes,
            replies: req.body.replies,
            edited: req.body.edited,
            deleted: req.body.deleted
          };
          const response = await mongodb.getDb().db('Taskify').collection('comments').replaceOne({ _id: commentId }, comment);
          console.log(response);
          if (response.modifiedCount > 0) {
            res.status(204).send();
          } else {
            res.status(500).json(response.error || 'Some error occurred while updating this comment entry.');
          }
        } catch (err) {
          res.status(500).json(err);
        }
      };

      const deleteComment = async (req, res) => {
        try{
            const commentId = new ObjectId(req.params.id);
            const response = await mongodb.getDb().db('Taskify').collection('comments').deleteOne({ _id: commentId }, true);
            console.log(response);
            if (response.deletedCount > 0) {
                res.status(204).send();
            } else {
                res.status(500).json(response.error || 'Some error occurred while deleting the comment.');
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
    }
};
