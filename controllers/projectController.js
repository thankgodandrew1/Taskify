const mongodb = require('../config/db');

const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    const response = await mongodb.getDb().db('Taskify').collection('projects').find();
    console.log(response);
    response.toArray().then((lists) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);
    });
};

const getSingle = async (req, res) => {

    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid project id to find a project.');
    }

    const projectId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db('Taskify').collection('projects').find({ _id: projectId });
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
    getAll,
    getSingle
}