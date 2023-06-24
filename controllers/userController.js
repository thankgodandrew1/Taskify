const { ObjectId } = require('mongodb');

module.exports = (usersCollection) => {
  const getUsers = async (req, res) => {
    try {
      const users = await usersCollection.find({}).toArray();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };
  const getUserById = async (req, res) => {
    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(req.params.id) });
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };

  const getUserByEmail = async (req, res) => {
    try {
      const user = await usersCollection.findOne({ email: 'andy663@cse341.net'});
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };

  const createUser = async (req, res) => {
    try {

      const user = await usersCollection.insertOne({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        role: req.body.role,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address
      });
      res.json(user);

    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };


  return {
    getUsers,
    getUserById,
    getUserByEmail,
    createUser
  };
};
