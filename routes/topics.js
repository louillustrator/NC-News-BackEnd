const topicsRouter = require("express").Router();
const {
  getAllTopics,
  getArticlesForTopic,
  addArticleToTopic
} = require("../controllers/topics");

topicsRouter.route("/").get(getAllTopics);

topicsRouter
  .route("/:topic_slug/articles")
  .get(getArticlesForTopic)
  .post(addArticleToTopic);

module.exports = topicsRouter;
