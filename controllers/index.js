const { Topic } = require("../models");

const getAllTopics = (req, res, next) => {
  console.log("getting all topics....");
  Topic.find()
    .then(topics => {
      console.log(topics);
      res.status(200).send(topics);
    })
    .catch(next);
};

module.exports = { getAllTopics };
