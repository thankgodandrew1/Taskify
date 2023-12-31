const { validationResult } = require('express-validator');
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
      const userId = req.params.id;
      if (!ObjectId.isValid(userId)) {
        return res.status(400).send('Invalid user ID');
      }

      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
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
      //Don't know how to get the email
      const user = await usersCollection.findOne({ email: req.params.email });
      // console.log(user)
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
      // This Check for any validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

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

  const updateUser = async (req, res) => {
    try {
      // This Check for any validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const response = await usersCollection.replaceOne(
        { _id: new ObjectId(req.params.id) },
        (user = {
          name: req.body.name,
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          role: req.body.role,
          phoneNumber: req.body.phoneNumber,
          address: req.body.address
        })
      );
      console.log(response);

      res.json(response);
      //if (response.modifiedCount > 0) {
      //  res.status(204).send();
      //} else {
      //  res.status(500).json(response.error || 'Some error occurred while updating this user entry.');
      //}
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };

  const deleteUser = async (req, res) => {
    try {
      const userId = new ObjectId(req.params.id);
      const response = await usersCollection.deleteOne({ _id: userId }, true);
      console.log(response);
      if (response.deletedCount > 0) {
        res.status(200).send();
      } else {
        res.status(500).json(response.error || 'Some error occurred while deleting the user.');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };

  return {
    getUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser
  };
};
