const mongodb = require('../config/db');

const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    const response = await mongodb.getDb().db('Taskify').collection('comments').find();
    console.log(response);
    response.toArray().then((lists) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);
    });
};

const getSingle = async (req, res) => {

    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid comment id to find a comment.');
    }

    const commentId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db('Taskify').collection('comments').find({ _id: commentId });
    console.log(response);

    response.toArray().then((err, lists) => {
        if(err){
          res.status(400).json({ message: err });
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists[0]);
    });
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

module.exports = {
    getAll,
    getSingle,
    deleteComment
}