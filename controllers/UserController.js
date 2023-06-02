const { Users, Thought } = require('../models');

const userController = {

  // Get all users
  getAllUsers(req, res) {
    Users.find({})
      .populate({
        path: 'friends',
        select: '-__v',
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then((userData) => res.json(userData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // Get a user by ID
  getUserById({ params }, res) {
    Users.findOne({ _id: params.id })
      .populate({
        path: 'thought',
        select: '-__v',
      })
      .populate({
        path: 'friends',
        select: '-__v',
      })
      .select('-__v')
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: 'User not found!' });
        }

        res.json(userData);

      })
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // Create a new user
  createUser({ body }, res) {
    Users.create(body)
      .then((userData) => res.json(userData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // Update a user
  updateUser({ params, body }, res) {
    Users.findOneAndUpdate(
      { _id: params.id },
      body,
      { new: true, runValidators: true, })
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: 'User not found!' });
        }

        res.json(userData);

      })
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // Delete a user
  deleteUser({ params }, res) {
    Users.findOneAndDelete({ _id: params.id })
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: 'User not found!' });
        }

        return Thought.deleteMany({ _id: { $in: userData.thought } });
      })
      .then(() => {
        res.json({ message: 'User has been deleted!' });
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // Add a friend to a user's friend list
  addFriend({ params }, res) {
    Users.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: 'User not found!' });
        }

        res.json(userData);

      })
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // Remove a friend from a user's friend list
  removeFriend({ params }, res) {
    Users.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: 'User not found!' });
        }

        res.json(userData);

      })
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },
};


module.exports = userController;
