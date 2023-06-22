const mongodb = require('../config/db');

const ObjectId = require('mongodb').ObjectId;

const getTasks = async (req, res) => {
    const response = await mongodb.getDb().db('Taskify').collection('tasks').find();
    console.log(response);
    response.toArray().then((lists) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);
    });
};

const getSingle = async (req, res) => {

    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid task id to find a task.');
    }

    const taskId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db('Taskify').collection('tasks').find({ _id: taskId });
    console.log(response);

    response.toArray().then((err, lists) => {
        if(err){
          res.status(400).json({ message: err });
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists[0]);
    });
};

module.exports = {
    getTasks,
    getSingle
}