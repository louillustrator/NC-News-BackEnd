const topicsRouter = require("express").Router();
const { getAllTopics } = require("../controllers");

topicsRouter.route("/").get(getAllTopics);

module.exports = topicsRouter;
