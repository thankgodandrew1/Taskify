const { ObjectId } = require('mongodb');

module.exports = (tasksCollection) => {
    const getTasks = async (req, res) => {
        try {
            const tasks = await tasksCollection.find({}).toArray();
            res.json(tasks);
        } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
        }
    };

    return{
        getTasks
    }
}