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

    return {
        getComments
    }
};
