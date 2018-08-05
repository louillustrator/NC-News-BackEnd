const { Topic, Article, User, Comment } = require("../models");

const getAllUsers = (req, res, next) => {
  User.find()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};

const getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  User.findOne({ username: `${username}` })
    .then(user => {
      user !== null
        ? res.status(200).send({ user })
        : next({ status: 404, msg: "that is not a username please try again" });
    })
    .catch(next);
};

module.exports = { getUserByUsername, getAllUsers };
