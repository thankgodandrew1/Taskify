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

    return {
        getComments,
        getCommentById,
        createComment
    }
};
